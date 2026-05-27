import React from 'react';
import './UploadForm.css';

export const ProgressBar = ({ progress, statusText }) => {
  return (
    <div className="progress-container anim-fade-in">
      <div className="progress-header">
        <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{statusText || 'Uploading...'}</span>
        <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{Math.round(progress)}%</span>
      </div>
      <div className="progress-track">
        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
      </div>
    </div>
  );
};
