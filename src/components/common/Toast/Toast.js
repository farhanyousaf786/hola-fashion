import React, { useState, useEffect } from 'react';
import './Toast.css';

const Toast = ({ message, type = 'info', duration = 4000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onClose && onClose();
      }, 300); // Wait for fade out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!message) return null;

  return (
    <div className={`toast ${type} ${isVisible ? 'toast-show' : 'toast-hide'}`}>
      <div className="toast-content">
        <span className="toast-message">{message}</span>
        <button 
          className="toast-close" 
          onClick={() => {
            setIsVisible(false);
            setTimeout(() => onClose && onClose(), 300);
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default Toast;
