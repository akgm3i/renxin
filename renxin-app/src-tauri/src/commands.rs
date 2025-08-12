// renxin-app/src-tauri/src/commands.rs

use std::path::PathBuf;
use tauri::Manager;
use crate::config::Config;
use crate::state::AppState;
use crate::logging::create_diagnostic_zip;

#[tauri::command]
pub fn get_config(state: tauri::State<AppState>) -> Result<Config, String> {
    Ok(state.config.lock().unwrap().clone())
}

#[tauri::command]
pub fn update_config(config: Config, state: tauri::State<AppState>) -> Result<(), String> {
    let mut current_config = state.config.lock().unwrap();
    *current_config = config;
    let toml_string = toml::to_string_pretty(&*current_config)
        .map_err(|e| format!("Failed to serialize config: {}", e))?;
    std::fs::write(&state.config_path, toml_string)
        .map_err(|e| format!("Failed to write config file: {}", e))?;
    Ok(())
}

#[tauri::command]
pub fn export_diagnostic_info(
    app_handle: tauri::AppHandle,
    state: tauri::State<'_, AppState>,
    output_dir: PathBuf,
) -> Result<String, String> {
    let log_dir = app_handle
        .path()
        .app_log_dir()
        .map_err(|e| e.to_string())?;
    let log_path = log_dir.join("renxin.log");
    let config_path = state.config_path.clone();

    match create_diagnostic_zip(&config_path, &log_path, &output_dir) {
        Ok(path) => Ok(format!("Successfully exported to {:?}", path)),
        Err(e) => Err(e.to_string()),
    }
}
