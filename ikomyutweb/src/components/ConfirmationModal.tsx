import React from 'react';
import '../styles/ConfirmationModal.css';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDangerous?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  isDangerous = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content confirmation-modal" onClick={(e) => e.stopPropagation()}>
        <div className="confirmation-header">
          <div className={`confirmation-icon ${isDangerous ? 'dangerous' : ''}`}>
            {isDangerous ? '⚠️' : '❓'}
          </div>
          <h2>{title}</h2>
          <p>{message}</p>
        </div>

        <div className="confirmation-actions">
          <button 
            className={`btn ${isDangerous ? 'btn--danger' : 'btn--primary'}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
          <button 
            className="btn btn--secondary"
            onClick={onCancel}
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
