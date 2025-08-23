import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UploadPage from './UploadPage.jsx';
import SuccessPage from './SuccessPage.jsx';
import DownloadPage from './DownloadPage.jsx';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UploadPage />} />
        <Route path="/success/:uuid" element={<SuccessPage />} />
        <Route path="/download/:uuid" element={<DownloadPage />} />
      </Routes>
    </BrowserRouter>
  );
}
