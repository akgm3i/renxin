// renxin-app/src-tauri/src/database.rs

use std::path::Path;

pub fn initialize_database(db_path: &Path) -> anyhow::Result<()> {
    let conn = rusqlite::Connection::open(db_path)?;

    conn.execute_batch(
        "
        CREATE TABLE IF NOT EXISTS players (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS games (
            id TEXT PRIMARY KEY,
            game_type TEXT NOT NULL,
            status TEXT NOT NULL,
            started_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            ended_at TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS game_participants (
            id TEXT PRIMARY KEY,
            game_id TEXT NOT NULL,
            player_id TEXT NOT NULL,
            turn_order INTEGER NOT NULL,
            FOREIGN KEY (game_id) REFERENCES games(id),
            FOREIGN KEY (player_id) REFERENCES players(id)
        );
        CREATE TABLE IF NOT EXISTS rounds (
            id TEXT PRIMARY KEY,
            game_id TEXT NOT NULL,
            round_number INTEGER NOT NULL,
            FOREIGN KEY (game_id) REFERENCES games(id)
        );
        CREATE TABLE IF NOT EXISTS throws (
            id TEXT PRIMARY KEY,
            round_id TEXT NOT NULL,
            participant_id TEXT NOT NULL,
            throw_number INTEGER NOT NULL,
            segment TEXT NOT NULL,
            posture_video_path TEXT,
            board_video_path TEXT,
            FOREIGN KEY (round_id) REFERENCES rounds(id),
            FOREIGN KEY (participant_id) REFERENCES game_participants(id)
        );
        CREATE TABLE IF NOT EXISTS zero_one_round_states (
            id TEXT PRIMARY KEY,
            round_id TEXT NOT NULL,
            participant_id TEXT NOT NULL,
            score_remaining INTEGER NOT NULL,
            FOREIGN KEY (round_id) REFERENCES rounds(id),
            FOREIGN KEY (participant_id) REFERENCES game_participants(id)
        );
        CREATE TABLE IF NOT EXISTS cricket_marks (
            id TEXT PRIMARY KEY,
            round_id TEXT NOT NULL,
            participant_id TEXT NOT NULL,
            target_number TEXT NOT NULL,
            marks INTEGER NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (round_id) REFERENCES rounds(id),
            FOREIGN KEY (participant_id) REFERENCES game_participants(id)
        );
        CREATE TABLE IF NOT EXISTS cricket_scores (
            id TEXT PRIMARY KEY,
            round_id TEXT NOT NULL,
            participant_id TEXT NOT NULL,
            score INTEGER NOT NULL,
            FOREIGN KEY (round_id) REFERENCES rounds(id),
            FOREIGN KEY (participant_id) REFERENCES game_participants(id)
        );
        ",
    )?;

    Ok(())
}
