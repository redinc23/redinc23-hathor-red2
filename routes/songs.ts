import express from 'express';
import db from '../database';

const router = express.Router();

// Get all songs
router.get('/', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM songs');
    const songs = stmt.all();
    res.json(songs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch songs' });
  }
});

// Get song by ID
router.get('/:id', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM songs WHERE id = ?');
    const song = stmt.get(req.params.id);
    if (!song) return res.status(404).json({ error: 'Song not found' });
    res.json(song);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch song' });
  }
});

// Add a song (Admin/Upload)
router.post('/', (req, res) => {
  const { title, artist, url, stems, duration } = req.body;
  if (!title || !artist || !url) {
    return res.status(400).json({ error: 'Title, artist, and URL required' });
  }

  try {
    const stmt = db.prepare('INSERT INTO songs (title, artist, url, stems, duration) VALUES (?, ?, ?, ?, ?)');
    const result = stmt.run(title, artist, url, JSON.stringify(stems || {}), duration || 0);
    res.json({ id: result.lastInsertRowid, title, artist, url, stems, duration });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add song' });
  }
});

export default router;
