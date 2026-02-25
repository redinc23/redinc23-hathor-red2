import express from 'express';
import db from '../database';

const router = express.Router();

// Get all playlists
router.get('/', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM playlists');
    const playlists = stmt.all();
    res.json(playlists);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch playlists' });
  }
});

// Create a playlist
router.post('/', (req, res) => {
  const { name, user_id, songs } = req.body;
  if (!name || !user_id) {
    return res.status(400).json({ error: 'Name and user_id required' });
  }

  try {
    const stmt = db.prepare('INSERT INTO playlists (name, user_id, songs) VALUES (?, ?, ?)');
    const result = stmt.run(name, user_id, JSON.stringify(songs || []));
    res.json({ id: result.lastInsertRowid, name, user_id, songs });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create playlist' });
  }
});

export default router;
