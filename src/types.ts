export interface User {
  id: number;
  username: string;
}

export interface Song {
  id: number;
  title: string;
  artist: string;
  url: string;
  stems: string; // JSON string
  duration: number;
}

export interface Playlist {
  id: number;
  name: string;
  user_id: number;
  songs: string; // JSON array of song IDs
}

export interface Room {
  id: string;
  name: string;
  host_id: number;
  current_song_id: number | null;
  current_time: number;
  is_playing: boolean;
}
