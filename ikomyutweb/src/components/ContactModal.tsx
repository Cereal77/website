import React, { useState } from 'react';
import '../styles/ContactModal.css';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [verificationSent, setVerificationSent] = useState(false);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Email validation regex - stricter validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
    const email = formData.email.trim();

    // Validate email format
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    // Check minimum length
    if (email.length < 5) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    // Check if it starts or ends with a dot or has consecutive dots
    if (email.startsWith('.') || email.endsWith('.') || email.includes('..')) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data.error || data.message || 'Failed to send message';
        throw new Error(errorMsg);
      }

      // Show verification sent message
      setVerificationSent(true);

      setTimeout(() => {
        setVerificationSent(false);
        setFormData({ name: '', email: '', message: '' });
        onClose();
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content contact-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose}>
          ×
        </button>

        <div className="contact-header">
          <h2>Contact Us</h2>
          <p>Have questions? We'd love to hear from you!</p>
        </div>

        {success ? (
          <div className="contact-success">
            <div className="success-icon">✓</div>
            <p>Thank you! Your message has been sent successfully.</p>
          </div>
        ) : verificationSent ? (
          <div className="contact-success" style={{ background: '#e8f5e9', borderRadius: '8px', padding: '24px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📧</div>
            <h3 style={{ margin: '0 0 12px', color: '#2e7d32' }}>Check Your Email</h3>
            <p style={{ margin: '0 0 12px', color: '#555' }}>We sent a verification email to:</p>
            <p style={{ margin: '0 0 20px', color: '#2e7d32', fontWeight: 'bold' }}>{formData.email}</p>
            <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>Please click the link in the email to verify your message and let us know you received it.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="contact-form">
            {error && (
              <div className="form-error" style={{ color: '#d32f2f', marginBottom: '12px', fontSize: '14px' }}>
                {error}
              </div>
            )}

            {/* NAME */}
            <div className="form-group">
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                required
                disabled={loading}
              />
            </div>

            {/* EMAIL */}
            <div className="form-group">
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                required
                disabled={loading}
              />
            </div>

            {/* MESSAGE */}
            <div className="form-group">
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Message"
                rows={5}
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="btn btn--primary"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>

          </form>
        )}
      </div>
    </div>
  );
};

export default ContactModal;
