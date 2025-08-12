// renxin-app/src-tauri/src/state.rs

use std::sync::Mutex;
use std::path::PathBuf;
use crate::config::Config;

pub struct AppState {
    pub config: Mutex<Config>,
    pub config_path: PathBuf,
}

impl AppState {
    pub fn new(config: Config, config_path: PathBuf) -> Self {
        Self {
            config: Mutex::new(config),
            config_path,
        }
    }
}
