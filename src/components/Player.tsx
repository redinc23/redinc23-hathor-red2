import React, { useState } from 'react';
import { usePlayer } from '../contexts/PlayerContext';
import { Play, Pause, SkipForward, SkipBack, Volume2 } from 'lucide-react';

const Player: React.FC = () => {
  const { 
    currentSong, 
    isPlaying, 
    play, 
    pause, 
    resume, 
    next, 
    prev, 
    vibe, 
    setVibe, 
    volume, 
    setVolume,
    currentTime,
    duration,
    seek
  } = usePlayer();

  const [stems, setStems] = useState({
    vocals: true,
    drums: true,
    bass: true,
    other: true
  });

  const toggleStem = (stem: keyof typeof stems) => {
    setStems(prev => ({ ...prev, [stem]: !prev[stem] }));
    // In a real implementation, this would mute/unmute specific AudioNodes
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  if (!currentSong) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 p-4 text-white z-50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Song Info */}
        <div className="flex items-center w-full md:w-1/4">
          <div className="w-12 h-12 bg-red-600 rounded mr-4 flex items-center justify-center">
            <span className="text-xl">🎵</span>
          </div>
          <div>
            <h3 className="font-bold truncate">{currentSong.title}</h3>
            <p className="text-sm text-gray-400 truncate">{currentSong.artist}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center w-full md:w-2/4">
          <div className="flex items-center space-x-6 mb-2">
            <button onClick={prev} className="hover:text-red-500 transition"><SkipBack size={24} /></button>
            <button 
              onClick={isPlaying ? pause : resume} 
              className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition"
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} fill="currentColor" />}
            </button>
            <button onClick={next} className="hover:text-red-500 transition"><SkipForward size={24} /></button>
          </div>
          
          <div className="w-full flex items-center space-x-2 text-xs text-gray-400">
            <span>{formatTime(currentTime)}</span>
            <input 
              type="range" 
              min="0" 
              max={duration || 100} 
              value={currentTime} 
              onChange={(e) => seek(Number(e.target.value))}
              className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-500"
            />
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Vibe & Volume */}
        <div className="flex items-center justify-end w-full md:w-1/4 space-x-4">
          <div className="flex flex-col items-center">
            <label className="text-[10px] text-gray-500 uppercase">Speed</label>
            <input 
              type="range" 
              min="0.5" 
              max="2" 
              step="0.1" 
              value={vibe.speed} 
              onChange={(e) => setVibe({ ...vibe, speed: Number(e.target.value) })}
              className="w-20 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-500"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Volume2 size={16} />
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01" 
              value={volume} 
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-20 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-500"
            />
          </div>
        </div>
      </div>

      {/* Stem Controls (Desktop only usually, but responsive here) */}
      <div className="hidden md:flex justify-center mt-2 space-x-4">
        {Object.keys(stems).map((stem) => (
          <button
            key={stem}
            onClick={() => toggleStem(stem as keyof typeof stems)}
            className={`text-xs px-2 py-1 rounded border ${
              stems[stem as keyof typeof stems] 
                ? 'bg-red-900/30 border-red-500 text-red-400' 
                : 'bg-gray-800 border-gray-700 text-gray-500'
            }`}
          >
            {stem.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Player;
