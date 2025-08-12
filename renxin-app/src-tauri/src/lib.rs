// renxin-app/src-tauri/src/lib.rs

pub mod config;
pub mod database;
pub mod logging;
pub mod state;
pub mod commands;

use tauri::Manager;
use tauri_plugin_log::{Target, TargetKind, TimezoneStrategy, RotationStrategy};
use crate::config::load_or_create_config;
use crate::database::initialize_database;
use crate::logging::mask_sensitive_info;

// --- App Entry Point ---
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_log::Builder::new()
            .targets([
                Target::new(TargetKind::Stdout),
                Target::new(TargetKind::Webview),
                Target::new(TargetKind::LogDir { file_name: Some("renxin".into()) }),
            ])
            .rotation_strategy(RotationStrategy::KeepAll)
            .timezone_strategy(TimezoneStrategy::UseLocal)
            .format(move |out, message, record| {
                let masked_message = mask_sensitive_info(&message.to_string());
                out.finish(format_args!(
                    "[{}] [{}] {}",
                    chrono::Local::now().format("%Y-%m-%d %H:%M:%S"),
                    record.level(),
                    masked_message
                ))
            })
            .build())
        .setup(|app| {
            let app_data_dir = app.path().app_data_dir()
                .expect("Failed to get app data directory. Please check permissions.");
            match load_or_create_config(&app_data_dir) {
                Ok(state) => {
                    let db_path = {
                        let config = state.config.lock().unwrap();
                        config.data.database_path.clone()
                    };
                    if let Err(e) = initialize_database(&db_path) {
                        log::error!("Failed to initialize database: {:?}", e);
                        std::process::exit(1);
                    }
                    app.manage(state);
                    Ok(())
                }
                Err(e) => {
                    log::error!("Failed to initialize config: {:?}", e);
                    // For now, we will just exit. A real app should show a dialog.
                    std::process::exit(1);
                }
            }
        })
        .invoke_handler(tauri::generate_handler![
            commands::get_config,
            commands::update_config,
            commands::export_diagnostic_info
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}


// --- Tests ---
#[cfg(test)]
mod tests {
    use super::*;
    use tempfile::tempdir;
    use std::fs;
    use std::io::Read;

    #[test]
    fn test_initialize_database_creates_tables() {
        let dir = tempdir().unwrap();
        let db_path = dir.path().join("test.db");
        database::initialize_database(&db_path).unwrap();
        let conn = rusqlite::Connection::open(&db_path).unwrap();
        let mut stmt = conn.prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name").unwrap();
        let tables: Vec<String> = stmt.query_map([], |row| row.get(0)).unwrap().map(|r| r.unwrap()).collect();
        let expected_tables = vec![
            "cricket_marks",
            "cricket_scores",
            "game_participants",
            "games",
            "players",
            "rounds",
            "throws",
            "zero_one_round_states",
        ];
        assert_eq!(tables, expected_tables, "All expected tables should be created.");
    }

    #[test]
    fn test_create_default_config() {
        let dir = tempdir().unwrap();
        let app_data_dir = dir.path();
        let state = config::load_or_create_config(app_data_dir).unwrap();
        let config = state.config.lock().unwrap();
        assert!(state.config_path.exists());
        assert_eq!(config.camera.video_framerate, 30);
        assert_eq!(config.network.rpc_port, 8080);
        assert_eq!(config.data.database_path, app_data_dir.join("data.db"));
        assert_eq!(config.data.video_storage_path, app_data_dir.join("videos"));
        let toml_string = fs::read_to_string(&state.config_path).unwrap();
        let loaded_config: config::Config = toml::from_str(&toml_string).unwrap();
        assert_eq!(*config, loaded_config);
    }

    #[test]
    fn test_load_existing_config() {
        let dir = tempdir().unwrap();
        let app_data_dir = dir.path();
        let config_path = app_data_dir.join("config.toml");
        let mut custom_config = config::Config::default();
        custom_config.network.rpc_port = 9999;
        let toml_string = toml::to_string_pretty(&custom_config).unwrap();
        fs::write(&config_path, toml_string).unwrap();
        let state = config::load_or_create_config(app_data_dir).unwrap();
        let config = state.config.lock().unwrap();
        assert_eq!(config.network.rpc_port, 9999);
        assert_eq!(*config, custom_config);
    }

    #[test]
    fn test_load_invalid_config() {
        let dir = tempdir().unwrap();
        let app_data_dir = dir.path();
        let config_path = app_data_dir.join("config.toml");
        fs::write(&config_path, "this is not valid toml").unwrap();
        let result = config::load_or_create_config(app_data_dir);
        assert!(result.is_err());
    }

    #[test]
    fn test_mask_sensitive_info() {
        if let Some(home) = dirs::home_dir() {
            let home_str = home.to_str().unwrap();
            let user_path = format!("Error accessing {}/some/file.txt", home_str);
            let masked_path = logging::mask_sensitive_info(&user_path);
            assert!(masked_path.contains("[MASKED]"));
        }
        let ip_addr = "Connected to 192.168.1.100 successfully";
        let masked_ip = logging::mask_sensitive_info(ip_addr);
        assert_eq!(masked_ip, "Connected to [MASKED_IP] successfully");
    }

    #[test]
    fn test_create_diagnostic_zip() {
        let dir = tempdir().unwrap();
        let config_path = dir.path().join("config.toml");
        let log_path = dir.path().join("renxin.log");
        let output_dir = dir.path();
        fs::write(&config_path, "test_config = true").unwrap();
        fs::write(&log_path, "test log entry").unwrap();
        let zip_path = logging::create_diagnostic_zip(&config_path, &log_path, output_dir).unwrap();
        assert!(zip_path.exists());
        let file = fs::File::open(&zip_path).unwrap();
        let mut archive = zip::ZipArchive::new(file).unwrap();
        {
            let mut config_file = archive.by_name("config.toml").unwrap();
            let mut contents = String::new();
            config_file.read_to_string(&mut contents).unwrap();
            assert_eq!(contents, "test_config = true");
        }
        {
            let mut log_file = archive.by_name("renxin.log").unwrap();
            let mut contents = String::new();
            log_file.read_to_string(&mut contents).unwrap();
            assert_eq!(contents, "test log entry");
        }
    }
}
