import React from 'react';
import './LoginPromptModal.css';

const LoginPromptModal = ({ open, onClose, onGoToLogin }) => {
  if (!open) return null;
  return (
    <div className="lp-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="lp-modal-title">
      <div className="lp-modal">
        <h3 id="lp-modal-title" className="lp-modal-title">Login to view your favourites</h3>
        <p className="lp-modal-text">Sign in to add items to your wishlist and view your favourites across devices.</p>
        <div className="lp-modal-actions">
          <button className="lp-btn lp-btn-black" onClick={onGoToLogin}>
            Go to Login
          </button>
          <button className="lp-btn lp-btn-outline" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPromptModal;
