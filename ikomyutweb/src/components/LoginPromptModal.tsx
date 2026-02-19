import React from 'react';
import '../styles/LoginPromptModal.css';

interface LoginPromptModalProps {
  isOpen: boolean;
  onLoginClick: () => void;
  onClose: () => void;
}

const LoginPromptModal: React.FC<LoginPromptModalProps> = ({ isOpen, onLoginClick, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content login-prompt-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <div className="prompt-header">
          <div className="prompt-icon">🔐</div>
          <h2>Login Required</h2>
          <p>You need to login to view our pricing plans</p>
        </div>

        <div className="prompt-actions">
          <button className="btn btn--primary" onClick={onLoginClick}>
            Go to Login
          </button>
          <button className="btn btn--secondary" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPromptModal;
