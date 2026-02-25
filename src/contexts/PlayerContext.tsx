import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { Song } from '../types';
import { useSocket } from './SocketContext';

interface PlayerContextType {
  isPlaying: boolean;
  currentSong: Song | null;
  playlist: Song[];
  vibe: { speed: number; pitch: number };
  volume: number;
  currentTime: number;
  duration: number;
  play: (song: Song) => void;
  pause: () => void;
  resume: () => void;
  next: () => void;
  prev: () => void;
  seek: (time: number) => void;
  setVolume: (vol: number) => void;
  setVibe: (vibe: { speed: number; pitch: number }) => void;
  addToPlaylist: (song: Song) => void;
  setPlaylist: (songs: Song[]) => void;
  audioRef: React.RefObject<HTMLAudioElement>;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [playlist, setPlaylist] = useState<Song[]>([]);
  const [vibe, setVibe] = useState({ speed: 1.0, pitch: 0 });
  const [volume, setVolume] = useState(1.0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const socket = useSocket();

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = vibe.speed;
      // Pitch shift is tricky without Web Audio API, but playbackRate affects pitch.
      // If we want pitch independent of speed, we need preservesPitch=false (experimental)
      // or Web Audio API. For now, let's just use playbackRate as "speed/pitch" control.
      if ('preservesPitch' in audioRef.current) {
        (audioRef.current as any).preservesPitch = false; 
      }
    }
  }, [vibe]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const play = (song: Song) => {
    setCurrentSong(song);
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.src = song.url;
      audioRef.current.play();
    }
  };

  const pause = () => {
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const resume = () => {
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const next = () => {
    if (!currentSong || playlist.length === 0) return;
    const index = playlist.findIndex(s => s.id === currentSong.id);
    if (index < playlist.length - 1) {
      play(playlist[index + 1]);
    }
  };

  const prev = () => {
    if (!currentSong || playlist.length === 0) return;
    const index = playlist.findIndex(s => s.id === currentSong.id);
    if (index > 0) {
      play(playlist[index - 1]);
    }
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const addToPlaylist = (song: Song) => {
    setPlaylist(prev => [...prev, song]);
  };

  return (
    <PlayerContext.Provider value={{
      isPlaying,
      currentSong,
      playlist,
      vibe,
      volume,
      currentTime,
      duration,
      play,
      pause,
      resume,
      next,
      prev,
      seek,
      setVolume,
      setVibe,
      addToPlaylist,
      setPlaylist,
      audioRef
    }}>
      {children}
      <audio
        ref={audioRef}
        onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
        onDurationChange={() => setDuration(audioRef.current?.duration || 0)}
        onEnded={next}
      />
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};
