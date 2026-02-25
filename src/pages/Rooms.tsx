import React, { useState } from 'react';
import ListeningRoom from '../components/ListeningRoom';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Rooms: React.FC = () => {
  const [roomId, setRoomId] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleJoin = (id: string) => {
    setRoomId(id);
  };

  const handleCreate = () => {
    const newRoomId = Math.random().toString(36).substring(7);
    setRoomId(newRoomId);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-red-600">Listening Rooms</h1>
        <button 
          onClick={() => navigate('/')}
          className="text-gray-400 hover:text-white"
        >
          Back to Home
        </button>
      </header>

      {roomId ? (
        <ListeningRoom roomId={roomId} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-900 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 text-red-500">Create Room</h2>
            <p className="text-gray-400 mb-4">Start a new listening session.</p>
            <button 
              onClick={handleCreate}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition"
            >
              Create Room
            </button>
          </div>

          <div className="bg-gray-900 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 text-red-500">Join Room</h2>
            <p className="text-gray-400 mb-4">Enter a room ID to join.</p>
            <div className="flex space-x-2">
              <input 
                type="text" 
                placeholder="Room ID" 
                className="w-full p-2 bg-gray-800 rounded border border-gray-700 focus:border-red-500 outline-none text-white"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleJoin((e.target as HTMLInputElement).value);
                  }
                }}
              />
              <button 
                onClick={() => {
                  const input = document.querySelector('input[placeholder="Room ID"]') as HTMLInputElement;
                  if (input.value) handleJoin(input.value);
                }}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded transition"
              >
                Join
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rooms;
