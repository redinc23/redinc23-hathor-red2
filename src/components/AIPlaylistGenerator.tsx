import React, { useState } from 'react';
import api from '../services/api';
import { Song } from '../types';
import { usePlayer } from '../contexts/PlayerContext';

const AIPlaylistGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Song[]>([]);
  const { setPlaylist, play } = usePlayer();

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    try {
      const res = await api.post('/ai/generate-playlist', { prompt });
      if (Array.isArray(res.data)) {
        setSuggestions(res.data);
      } else {
        console.error('AI response is not an array:', res.data);
        setSuggestions([]);
      }
    } catch (err) {
      console.error('Failed to generate playlist', err);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayAll = () => {
    if (suggestions.length > 0) {
      setPlaylist(suggestions);
      play(suggestions[0]);
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4 text-red-500">AI Playlist Generator</h2>
      <div className="flex space-x-2 mb-4">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your vibe (e.g., 'Late night coding session')"
          className="w-full p-2 bg-gray-800 rounded border border-gray-700 focus:border-red-500 outline-none text-white"
        />
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition disabled:opacity-50"
        >
          {loading ? 'Generating...' : 'Generate'}
        </button>
      </div>

      {suggestions.length > 0 && (
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-bold text-white">Suggestions</h3>
            <button 
              onClick={handlePlayAll}
              className="text-sm text-red-400 hover:text-red-300"
            >
              Play All
            </button>
          </div>
          <ul className="space-y-2">
            {suggestions.map((song) => (
              <li key={song.id} className="flex items-center justify-between p-2 bg-gray-800 rounded">
                <span className="text-white">{song.title} - {song.artist}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AIPlaylistGenerator;
