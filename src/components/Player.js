import React, { useState, useEffect } from 'react';

export default function Player({ audioRef, onNext, onPrev, songs, currentIndex }) {
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    function onPlay() { setPlaying(true); }
    function onPause() { setPlaying(false); }
    function onTime() { setTime(a.currentTime || 0); }
    function onLoaded() { setDuration(a.duration || 0); }
    function onEnded() { setPlaying(false); onNext(); }

    a.addEventListener('play', onPlay);
    a.addEventListener('pause', onPause);
    a.addEventListener('timeupdate', onTime);
    a.addEventListener('loadedmetadata', onLoaded);
    a.addEventListener('ended', onEnded);

    return () => {
      a.removeEventListener('play', onPlay);
      a.removeEventListener('pause', onPause);
      a.removeEventListener('timeupdate', onTime);
      a.removeEventListener('loadedmetadata', onLoaded);
      a.removeEventListener('ended', onEnded);
    };
  }, [audioRef, onNext]);

  function togglePlay() {
    if (!audioRef.current) return;
    if (audioRef.current.paused) audioRef.current.play();
    else audioRef.current.pause();
  }

  function format(sec) {
    if (!sec || isNaN(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  const current = songs && songs[currentIndex];

  return (
    <div className="player">
      <div className="player-info">
        <div className="now">
          {current ? `${current.title} — ${current.artist}` : 'No song selected'}
        </div>
      </div>

      <div className="player-controls">
        <button onClick={onPrev}>Prev</button>
        <button onClick={togglePlay}>{playing ? 'Pause' : 'Play'}</button>
        <button onClick={onNext}>Next</button>
      </div>

      <div className="progress">
        <span>{format(time)}</span>
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={time}
          onChange={(e) => {
            if (!audioRef.current) return;
            audioRef.current.currentTime = Number(e.target.value);
          }}
        />
        <span>{format(duration)}</span>
      </div>
    </div>
  );
}
