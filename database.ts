import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'hathor.db');
const db = new Database(dbPath);

export function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS songs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      artist TEXT NOT NULL,
      url TEXT NOT NULL,
      stems TEXT, -- JSON string of stem URLs {vocals: '...', drums: '...'}
      duration INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS playlists (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      user_id INTEGER NOT NULL,
      songs TEXT, -- JSON array of song IDs
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
    
    -- Seed some initial songs if empty
    INSERT OR IGNORE INTO songs (title, artist, url, stems, duration) VALUES 
    ('Neon Dreams', 'Synthwave Collective', 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=neon-gaming-19060.mp3', '{"vocals": "", "drums": "", "bass": "", "other": ""}', 180),
    ('Cyber City', 'Future Beats', 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=future-bass-15832.mp3', '{"vocals": "", "drums": "", "bass": "", "other": ""}', 210),
    ('Night Drive', 'Retro Wave', 'https://cdn.pixabay.com/download/audio/2021/11/23/audio_035a3ddc43.mp3?filename=night-city-12345.mp3', '{"vocals": "", "drums": "", "bass": "", "other": ""}', 240);
  `);
}

export default db;
