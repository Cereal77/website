import React, { useState } from 'react';
import '../styles/PricingModal.css';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlan?: (planName: string, planPrice: string) => void;
}

const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose, onSelectPlan }) => {
  const [selectedPlan, setSelectedPlan] = useState<{ name: string; price: string } | null>(null);

  if (!isOpen) return null;

  const handlePlanClick = (name: string, price: string) => {
    setSelectedPlan({ name, price });
    if (onSelectPlan) {
      onSelectPlan(name, price);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <div className="modal-header">
          <h2>Choose Your Pricing Plan</h2>
          <p>Select the perfect plan for your business needs</p>
        </div>

        <div className="pricing__grid modal-pricing">
         
          <div className="pricing__card">
            <h3 className="pricing__plan-name">Basic</h3>
            <p className="pricing__price">₱99<span>/month</span></p>
            <p className="pricing__description">For the basics</p>
            <ul className="pricing__features">
              <li>✓ Real-time bus tracking</li>
              <li>✓ Basic notifications</li>
              <li>✓ Email support</li>
              <li>✓ Mobile app access</li>
            </ul>
            <button 
              className="btn btn--secondary"
              onClick={() => handlePlanClick('Basic', '₱99/month')}
            >
              Choose Plan
            </button>
          </div>

          <div className="pricing__card pricing__card--featured">
            <div className="featured-badge">Most Popular</div>
            <h3 className="pricing__plan-name">Pro</h3>
            <p className="pricing__price">₱299<span>/month</span></p>
            <p className="pricing__description">Most popular</p>
            <ul className="pricing__features">
              <li>✓ Everything in Basic</li>
              <li>✓ Advanced analytics</li>
              <li>✓ Priority support</li>
              <li>✓ Custom alerts</li>
              <li>✓ Driver communication</li>
            </ul>
            <button 
              className="btn btn--primary"
              onClick={() => handlePlanClick('Pro', '₱299/month')}
            >
              Choose Plan
            </button>
          </div>

          <div className="pricing__card">
            <h3 className="pricing__plan-name">Enterprise</h3>
            <p className="pricing__price">Custom</p>
            <p className="pricing__description">For large operations</p>
            <ul className="pricing__features">
              <li>✓ Everything in Pro</li>
              <li>✓ Custom integrations</li>
              <li>✓ 24/7 dedicated support</li>
              <li>✓ API access</li>
              <li>✓ White-label options</li>
            </ul>
            <button 
              className="btn btn--secondary"
              onClick={() => handlePlanClick('Enterprise', 'Custom')}
            >
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingModal;
