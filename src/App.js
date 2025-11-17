import React, { useState, useEffect, useRef } from 'react';
import UploadForm from './components/UploadForm';
import SearchBar from './components/SearchBar';
import SongList from './components/SongList';
import Player from './components/Player';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

export default function App() {
  const [songs, setSongs] = useState([]);
  const [query, setQuery] = useState('');
  const [currentIndex, setCurrentIndex] = useState(-1);
  const audioRef = useRef(null);

  async function fetchSongs(q = '') {
    const url = new URL(`${API_BASE}/api/songs`);
    if (q) url.searchParams.append('search', q);
    const res = await fetch(url.toString());
    const body = await res.json();
    setSongs(body.songs || []);
  }

  useEffect(() => {
    fetchSongs();
  }, []);

  useEffect(() => {
    // when currentIndex set, load and play
    if (currentIndex >= 0 && songs[currentIndex]) {
      const id = songs[currentIndex]._id;
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = `${API_BASE}/api/songs/${id}/stream`;
        audioRef.current.load();
        audioRef.current.play().catch(() => {});
      }
    } else if (audioRef.current) {
      audioRef.current.src = '';
    }
  }, [currentIndex, songs]);

  function handlePlayIndex(i) {
    setCurrentIndex(i);
  }

  function handleNext() {
    if (songs.length === 0) return;
    setCurrentIndex((idx) => {
      if (idx < 0) return 0;
      return (idx + 1) % songs.length;
    });
  }
  function handlePrev() {
    if (songs.length === 0) return;
    setCurrentIndex((idx) => {
      if (idx <= 0) return songs.length - 1;
      return idx - 1;
    });
  }

  return (
    <div className="app">
      <h1>Musify 🎵</h1>

      <section className="upload-search-row">
        <UploadForm onUploaded={() => fetchSongs(query)} apiBase={API_BASE} />
        <SearchBar
          onSearch={(q) => { setQuery(q); fetchSongs(q); }}
        />
      </section>

      <SongList
        songs={songs}
        onPlayIndex={handlePlayIndex}
        currentIndex={currentIndex}
      />

      <Player
        audioRef={audioRef}
        onNext={handleNext}
        onPrev={handlePrev}
        songs={songs}
        currentIndex={currentIndex}
      />

      <audio ref={audioRef} style={{ display: 'none' }} />
    </div>
  );
}
