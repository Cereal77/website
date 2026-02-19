import React from 'react';
import '../styles/LoadingSpinner.css';

interface LoadingSpinnerProps {
  isVisible: boolean;
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ isVisible, message = 'Loading...' }) => {
  if (!isVisible) return null;

  return (
    <div className="loading-overlay">
      <div className="loading-spinner-container">
        <div className="spinner-ring"></div>
        <p className="loading-message">{message}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
