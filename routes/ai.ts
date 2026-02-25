import express from 'express';
import { GoogleGenAI } from '@google/genai';
import db from '../database';

const router = express.Router();

// Initialize Gemini
// Note: API Key is injected by the environment
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

router.post('/generate-playlist', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    // 1. Fetch all available songs
    const songs = db.prepare('SELECT id, title, artist FROM songs').all();
    
    // 2. Construct the prompt
    const songList = JSON.stringify(songs);
    const systemInstruction = `You are a music curator.
    You have access to the following library of songs: ${songList}.
    Select up to 5 songs from this library that best match the user's request.
    Return ONLY a JSON array of the selected song IDs. Do not include any other text.
    Example: [1, 3, 5]`;

    // 3. Call Gemini
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: 'application/json'
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error('No response from AI');
    }

    const songIds = JSON.parse(text);
    
    // 4. Fetch the full song details
    if (!Array.isArray(songIds) || songIds.length === 0) {
      return res.json([]);
    }

    const placeholders = songIds.map(() => '?').join(',');
    const stmt = db.prepare(`SELECT * FROM songs WHERE id IN (${placeholders})`);
    const playlistSongs = stmt.all(...songIds);

    res.json(playlistSongs);

  } catch (err) {
    console.error('AI Error:', err);
    res.status(500).json({ error: 'Failed to generate playlist' });
  }
});

export default router;
