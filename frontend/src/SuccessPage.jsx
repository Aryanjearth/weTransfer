import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

export default function SuccessPage() {
  const { uuid } = useParams();
  const downloadLink = uuid ? `http://localhost:5000/api/files/download/${uuid}` : '';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (downloadLink) {
      navigator.clipboard.writeText(downloadLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    }
  };

  return (
    <div className="app-container">
      <h2>File Uploaded!</h2>
      <div className="success-link-box">
        <input
          type="text"
          value={downloadLink}
          readOnly
          style={{ width: '100%', marginBottom: 7 }}
        />
        <button style={{ width: '100%' }} onClick={handleCopy} disabled={!downloadLink}>
          {copied ? 'Copied!' : 'Copy Link'}
        </button>
      </div>
      <div className="meta-info">You can share this link or send via email (if entered).</div>
      {downloadLink && <a href={`/download/${uuid}`}>Go to Download Page</a>}
    </div>
  );
}
