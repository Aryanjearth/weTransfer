import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function UploadPage() {
  const [file, setFile] = useState();
  const [sender, setSender] = useState('');
  const [receiver, setReceiver] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    formData.append('sender_email', sender);
    formData.append('receiver_email', receiver);

    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/files/upload', formData);
      setLoading(false);
      if (res.data.uuid) {
        setSuccess('File uploaded successfully!');
        setTimeout(() => {
          navigate(`/success/${res.data.uuid}`);
        }, 1200);
      } else {
        setError('Upload succeeded, but no UUID was returned.');
        console.log('Response:', res.data);
      }
    } catch (err) {
      setLoading(false);
      setError('Upload failed.');
      console.error('Upload error:', err);
    }
  };

  return (
    <div className="app-container">
      <h2>Share a File</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          name="file"
          required
          onChange={e => setFile(e.target.files[0])}
        />
        {file && (
          <div style={{ margin: "10px 0", color: "#234", fontSize: "14px" }}>
            <strong>Selected file:</strong> {file.name} ({(file.size / 1024).toFixed(1)} KB)
          </div>
        )}
        <input
          type="email"
          placeholder="Your email (optional)"
          value={sender}
          onChange={e => setSender(e.target.value)}
        />
        <input
          type="email"
          placeholder="Recipient's email (optional)"
          value={receiver}
          onChange={e => setReceiver(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Uploading...' : 'Upload and Get Link'}
        </button>
      </form>
      {error && <p style={{ color: 'red', marginTop: 10 }}>{error}</p>}
      {success && <p style={{ color: 'green', marginTop: 10 }}>{success}</p>}
    </div>
  );
}
