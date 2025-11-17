import React, { useState } from 'react';

export default function SearchBar({ onSearch }) {
  const [q, setQ] = useState('');

  function submit(e) {
    e.preventDefault();
    onSearch(q);
  }

  return (
    <form className="search-bar" onSubmit={submit}>
      <input
        placeholder="Search songs or artists"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <button type="submit">Search</button>
    </form>
  );
}
