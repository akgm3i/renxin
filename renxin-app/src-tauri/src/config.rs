// renxin-app/src-tauri/src/config.rs

use anyhow::Context;
use serde::{Deserialize, Serialize};
use std::fs;
use std::path::{Path, PathBuf};
use thiserror::Error;
use crate::state::AppState;

// --- Custom Error ---
#[derive(Debug, Error, PartialEq)]
pub enum ConfigError {
    #[error("File I/O error: {0}")]
    Io(String), // Simplified for testing equality
    #[error("TOML serialization error: {0}")]
    TomlSerialize(String), // Simplified for testing equality
    #[error("TOML deserialization error: {0}")]
    TomlDeserialize(String), // Simplified for testing equality
}

// --- Config Definition ---
#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
#[serde(rename_all = "kebab-case")]
pub struct Config {
    pub camera: CameraConfig,
    pub data: DataConfig,
    pub network: NetworkConfig,
}

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
#[serde(rename_all = "kebab-case")]
pub struct CameraConfig {
    pub posture_camera_id: String,
    pub board_camera_id: String,
    pub video_resolution: String,
    pub video_framerate: u32,
}

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
#[serde(rename_all = "kebab-case")]
pub struct DataConfig {
    pub database_path: PathBuf,
    pub video_storage_path: PathBuf,
    pub auto_delete_days: u32,
}

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
#[serde(rename_all = "kebab-case")]
pub struct NetworkConfig {
    pub rpc_port: u16,
}

impl Default for Config {
    fn default() -> Self {
        Self {
            camera: CameraConfig {
                posture_camera_id: "".to_string(),
                board_camera_id: "".to_string(),
                video_resolution: "1280x720".to_string(),
                video_framerate: 30,
            },
            data: DataConfig {
                database_path: PathBuf::new(), // Resolved at runtime
                video_storage_path: PathBuf::new(), // Resolved at runtime
                auto_delete_days: 90,
            },
            network: NetworkConfig { rpc_port: 8080 },
        }
    }
}

// --- Initialization (Refactored for Testability) ---
pub fn load_or_create_config(app_data_dir: &Path) -> anyhow::Result<AppState> {
    if !app_data_dir.exists() {
        fs::create_dir_all(app_data_dir)?;
    }
    let config_path = app_data_dir.join("config.toml");

    if !config_path.exists() {
        println!("Config file not found, creating a default one.");
        let mut config = Config::default();
        config.data.database_path = app_data_dir.join("data.db");
        config.data.video_storage_path = app_data_dir.join("videos");

        let toml_string = toml::to_string_pretty(&config)?;
        fs::write(&config_path, toml_string)?;
        Ok(AppState::new(config, config_path))
    } else {
        println!("Loading config from: {:?}", config_path);
        let toml_string = fs::read_to_string(&config_path)?;
        let config: Config = toml::from_str(&toml_string)
            .with_context(|| format!("Failed to parse TOML from {:?}", config_path))?;
        Ok(AppState::new(config, config_path))
    }
}
