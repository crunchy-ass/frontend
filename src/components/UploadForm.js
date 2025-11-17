import React, { useState } from 'react';

export default function UploadForm({ onUploaded, apiBase }) {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) {
      setMsg('Select an audio file first');
      return;
    }
    setLoading(true);
    setMsg('');
    const fd = new FormData();
    fd.append('file', file);
    fd.append('title', title);
    fd.append('artist', artist);

    try {
      const res = await fetch(`${apiBase}/api/songs/upload`, {
        method: 'POST',
        body: fd
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || 'Upload failed');
      setMsg('Upload successful');
      setTitle('');
      setArtist('');
      setFile(null);
      if (onUploaded) onUploaded();
    } catch (err) {
      setMsg('Upload error: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="upload-form" onSubmit={handleSubmit}>
      <h3>Upload a song</h3>
      <input type="file" accept="audio/*" onChange={(e) => setFile(e.target.files[0])} />
      <input placeholder="Title (optional)" value={title} onChange={(e) => setTitle(e.target.value)} />
      <input placeholder="Artist (optional)" value={artist} onChange={(e) => setArtist(e.target.value)} />
      <button type="submit" disabled={loading}>{loading ? 'Uploading...' : 'Upload'}</button>
      <div className="upload-msg">{msg}</div>
    </form>
  );
}
