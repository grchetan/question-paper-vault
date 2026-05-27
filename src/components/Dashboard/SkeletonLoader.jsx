import React from 'react';
import './Dashboard.css';

export const SkeletonLoader = ({ count = 6 }) => {
  return (
    <div className="papers-grid">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="skeleton-card glass-panel" aria-hidden="true"></div>
      ))}
    </div>
  );
};
