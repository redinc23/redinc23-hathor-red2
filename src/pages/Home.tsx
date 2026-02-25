import React from 'react';
import SongList from '../components/SongList';
import AIPlaylistGenerator from '../components/AIPlaylistGenerator';
import Player from '../components/Player';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      <header className="bg-gray-900 border-b border-gray-800 p-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-red-600">Hathor</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-300">Welcome, {user.username}</span>
            <button 
              onClick={logout}
              className="text-sm text-gray-400 hover:text-white"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <SongList />
        </div>
        <div className="space-y-6">
          <AIPlaylistGenerator />
          <div className="bg-gray-900 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 text-red-500">Listening Rooms</h2>
            <p className="text-gray-400 mb-4">Join a room to listen with friends.</p>
            <button 
              onClick={() => navigate('/rooms')}
              className="w-full bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded border border-gray-700 hover:border-red-500 transition"
            >
              Browse Rooms
            </button>
          </div>
        </div>
      </main>

      <Player />
    </div>
  );
};

export default Home;
