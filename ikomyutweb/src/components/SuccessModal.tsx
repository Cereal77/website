import React, { useEffect } from 'react';
import '../styles/SuccessModal.css';

interface SuccessModalProps {
  isOpen: boolean;
  message: string;
  planName?: string;
  paymentMethod?: string;
  onClose: () => void;
  autoCloseTime?: number;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  message,
  planName,
  paymentMethod,
  onClose,
  autoCloseTime = 3000,
}) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseTime);
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoCloseTime, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content success-modal" onClick={(e) => e.stopPropagation()}>
        <div className="success-icon">✓</div>
        
        <h2 className="success-title">Payment Successful!</h2>
        
        <p className="success-message">{message}</p>
        
        {planName && (
          <div className="success-details">
            <div className="detail-item">
              <span className="detail-label">Plan:</span>
              <span className="detail-value">{planName}</span>
            </div>
            {paymentMethod && (
              <div className="detail-item">
                <span className="detail-label">Payment Method:</span>
                <span className="detail-value">{paymentMethod.toUpperCase()}</span>
              </div>
            )}
          </div>
        )}
        
        <p className="success-closing">Redirecting in a moment...</p>
        
        <button className="btn btn--primary success-close" onClick={onClose}>
          Continue
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;
