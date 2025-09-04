import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
const backendUrl = "https://wetransfer-leve.onrender.com"
function getCountdown(expiryTime) {
  const end = new Date(expiryTime).getTime();
  const now = Date.now();
  const diff = Math.max(0, end - now);
  if (diff <= 0) return 'Expired';
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return `${hours}h ${minutes}m ${seconds}s`;
}

export default function DownloadPage() {
  const { uuid } = useParams();
  const [fileInfo, setFileInfo] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    axios.get(`${backendUrl}/api/files/info/${uuid}`)
      .then((res) => setFileInfo(res.data))
      .catch(() => setNotFound(true));
  }, [uuid]);

  useEffect(() => {
    if (!fileInfo?.expiry_time) return;
    const timer = setInterval(() => setCountdown(getCountdown(fileInfo.expiry_time)), 1000);
    return () => clearInterval(timer);
  }, [fileInfo]);

  if (notFound) return <div className="app-container">File not found or expired.</div>;
  if (!fileInfo) return <div className="app-container">Loading file info...</div>;

  return (
    <div className="app-container download-page">
      <h2>Download File</h2>
      <div><strong>File Name:</strong> {fileInfo.filename}</div>
      <div><strong>Expires in:</strong> {countdown === 'Expired' ? <span className="expired-label">{countdown}</span> : countdown}</div>
      <div><strong>Download count:</strong> {fileInfo.download_count}</div>
      <a href={`${backendUrl}/api/files/download/${uuid}`} target="_blank" rel="noopener noreferrer">
        <button disabled={countdown === 'Expired'}>Download</button>
      </a>
    </div>
  );
}
