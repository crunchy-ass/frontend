import React from 'react';

export default function SongList({ songs, onPlayIndex, currentIndex }) {
  return (
    <div className="song-list">
      <h3>Songs</h3>
      {songs.length === 0 && <div>No songs found</div>}
      <ul>
        {songs.map((s, i) => (
          <li key={s._id} className={i === currentIndex ? 'playing' : ''}>
            <div className="meta">
              <div className="title">{s.title}</div>
              <div className="artist">{s.artist}</div>
            </div>
            <div className="actions">
              <button onClick={() => onPlayIndex(i)}>{i === currentIndex ? 'Playing' : 'Play'}</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
