import React, { useEffect, useState } from 'react';
import { useSocket } from '../contexts/SocketContext';
import { usePlayer } from '../contexts/PlayerContext';
import { User } from '../types';

interface ListeningRoomProps {
  roomId: string;
}

const ListeningRoom: React.FC<ListeningRoomProps> = ({ roomId }) => {
  const socket = useSocket();
  const { isPlaying, currentSong, currentTime, vibe, play, pause, seek, setVibe } = usePlayer();
  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<{ user: string, text: string }[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!socket) return;

    socket.emit('join_room', roomId);

    socket.on('user_joined', (data) => {
      setUsers(prev => [...prev, { id: data.userId, username: `User ${data.userId.substr(0, 4)}` }]);
    });

    socket.on('playback_sync', (data) => {
      // data: { roomId, songId, currentTime, isPlaying, vibe }
      if (data.songId !== currentSong?.id) {
        // Fetch song by ID and play it (mocked here, ideally fetch from API)
        // For now, we assume the song is in the playlist or just log it
        console.log('Sync song change:', data.songId);
      }
      
      if (Math.abs(currentTime - data.currentTime) > 2) {
        seek(data.currentTime);
      }

      if (data.isPlaying !== isPlaying) {
        data.isPlaying ? play(currentSong!) : pause();
      }

      if (data.vibe && (data.vibe.speed !== vibe.speed || data.vibe.pitch !== vibe.pitch)) {
        setVibe(data.vibe);
      }
    });

    socket.on('receive_message', (data) => {
      setMessages(prev => [...prev, data]);
    });

    return () => {
      socket.off('user_joined');
      socket.off('playback_sync');
      socket.off('receive_message');
    };
  }, [socket, roomId, currentSong, isPlaying, currentTime, vibe]);

  const handleSendMessage = () => {
    if (!message || !socket) return;
    const msgData = { roomId, user: 'Me', text: message };
    socket.emit('send_message', msgData);
    setMessages(prev => [...prev, msgData]);
    setMessage('');
  };

  const handleSync = () => {
    if (!socket || !currentSong) return;
    socket.emit('playback_update', {
      roomId,
      songId: currentSong.id,
      currentTime,
      isPlaying,
      vibe
    });
  };

  return (
    <div className="bg-gray-900 rounded-lg shadow-lg p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-red-500">Room: {roomId}</h2>
        <button 
          onClick={handleSync}
          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
        >
          Sync Everyone
        </button>
      </div>

      <div className="flex-1 overflow-y-auto mb-4 bg-gray-800 rounded p-4">
        {messages.map((msg, idx) => (
          <div key={idx} className="mb-2">
            <span className="font-bold text-red-400">{msg.user}: </span>
            <span className="text-gray-300">{msg.text}</span>
          </div>
        ))}
      </div>

      <div className="flex space-x-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Chat..."
          className="w-full p-2 bg-gray-800 rounded border border-gray-700 focus:border-red-500 outline-none text-white"
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <button
          onClick={handleSendMessage}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ListeningRoom;
