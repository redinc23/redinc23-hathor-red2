import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Song } from '../types';
import { usePlayer } from '../contexts/PlayerContext';

const SongList: React.FC = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const { play, addToPlaylist } = usePlayer();

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const res = await api.get('/songs');
        console.log('Songs response:', res.data);
        if (Array.isArray(res.data)) {
          setSongs(res.data);
        } else {
          console.error('Songs response is not an array:', res.data);
          setSongs([]);
        }
      } catch (err) {
        console.error('Failed to fetch songs', err);
        setSongs([]);
      }
    };
    fetchSongs();
  }, []);

  return (
    <div className="bg-gray-900 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4 text-red-500">Library</h2>
      <ul className="space-y-4">
        {songs.map((song) => (
          <li key={song.id} className="flex items-center justify-between p-3 bg-gray-800 rounded hover:bg-gray-700 transition">
            <div>
              <h3 className="font-bold text-white">{song.title}</h3>
              <p className="text-sm text-gray-400">{song.artist}</p>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => play(song)}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition"
              >
                Play
              </button>
              <button 
                onClick={() => addToPlaylist(song)}
                className="bg-gray-600 hover:bg-gray-500 text-white px-3 py-1 rounded text-sm transition"
              >
                + Queue
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SongList;
