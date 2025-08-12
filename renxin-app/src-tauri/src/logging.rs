// renxin-app/src-tauri/src/logging.rs

use std::fs;
use std::path::{Path, PathBuf};

// --- Log Masking ---
pub fn mask_sensitive_info(message: &str) -> String {
    use regex::Regex;
    use dirs::home_dir;

    let mut message = message.to_string();

    // Mask file paths that might contain usernames, considering OS differences
    if let Some(home) = home_dir() {
        if let Some(home_str) = home.to_str() {
            // Escape special characters for regex, especially for Windows paths
            let escaped_home = regex::escape(home_str);
            let path_re = Regex::new(&format!(r"{}[/\\][^/\\]+", escaped_home)).unwrap();
            message = path_re.replace_all(&message, format!("{}[/\\\\][MASKED]", escaped_home)).to_string();
        }
    }

    // Mask IP addresses
    let ip_re = Regex::new(r"\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b").unwrap();
    ip_re.replace_all(&message, "[MASKED_IP]").to_string()
}


// --- Log Export ---
pub fn create_diagnostic_zip(
    config_path: &Path,
    log_path: &Path,
    output_dir: &Path,
) -> anyhow::Result<PathBuf> {
    let timestamp = chrono::Local::now().format("%Y%m%d").to_string();
    let zip_filename = format!("darts_diag_{}.zip", timestamp);
    let zip_path = output_dir.join(zip_filename);

    let file = fs::File::create(&zip_path)?;
    let mut zip = zip::ZipWriter::new(file);

    let options: zip::write::FileOptions<'_, ()> = zip::write::FileOptions::default()
        .compression_method(zip::CompressionMethod::Deflated)
        .unix_permissions(0o644);

    // Add config file
    if config_path.exists() {
        zip.start_file("config.toml", options)?;
        let mut config_file = fs::File::open(config_path)?;
        std::io::copy(&mut config_file, &mut zip)?;
    }

    // Add log file
    if log_path.exists() {
        zip.start_file("renxin.log", options)?;
        let mut log_file = fs::File::open(log_path)?;
        std::io::copy(&mut log_file, &mut zip)?;
    }

    zip.finish()?;
    Ok(zip_path)
}
