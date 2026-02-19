import React, { useState } from 'react';
import '../styles/PaymentModal.css';

interface PaymentModalProps {
  isOpen: boolean;
  planName: string;
  planPrice: string;
  onClose: () => void;
  onPaymentSelect: (method: string) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  planName,
  planPrice,
  onClose,
  onPaymentSelect,
}) => {
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);

  if (!isOpen) return null;

  const paymentMethods = [
    {
      id: 'gcash',
      name: 'GCash',
      icon: '📱',
      description: 'Fast and secure mobile payment',
    },
    {
      id: 'maya',
      name: 'Maya',
      icon: '💳',
      description: 'Digital wallet and card payments',
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: '🌐',
      description: 'International payment platform',
    },
  ];

  const handleConfirmPayment = () => {
    if (selectedPayment) {
      onPaymentSelect(selectedPayment);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content payment-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>

        <div className="payment-header">
          <h2>Select Payment Method</h2>
          <p>Plan: <strong>{planName}</strong> - {planPrice}</p>
        </div>

        <div className="payment-methods">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`payment-method ${selectedPayment === method.id ? 'active' : ''}`}
              onClick={() => setSelectedPayment(method.id)}
            >
              <input
                type="radio"
                id={method.id}
                name="payment"
                value={method.id}
                checked={selectedPayment === method.id}
                onChange={() => setSelectedPayment(method.id)}
              />
              <label htmlFor={method.id}>
                <div className="payment-icon">{method.icon}</div>
                <div className="payment-info">
                  <div className="payment-name">{method.name}</div>
                  <div className="payment-description">{method.description}</div>
                </div>
              </label>
            </div>
          ))}
        </div>

        <div className="payment-actions">
          <button
            className="btn btn--primary"
            onClick={handleConfirmPayment}
            disabled={!selectedPayment}
          >
            Continue to Payment
          </button>
          <button className="btn btn--secondary" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
