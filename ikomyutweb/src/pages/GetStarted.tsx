import React from 'react';
import '../styles/GetStarted.css';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

interface GetStartedProps {
  onBack: () => void;
  onGoToLogin?: () => void;
}

const GetStarted: React.FC<GetStartedProps> = ({ onBack, onGoToLogin }) => {
  const setupSection = useScrollAnimation();
  const benefitsSection = useScrollAnimation();
  const ctaSection = useScrollAnimation();

  return (
    <div className="page-container">
      <div className="page-header">
        <button className="back-button" onClick={onBack}>← Back</button>
        <h1>Get Started with iKomyutPH</h1>
        <p>Start tracking buses and managing your commute in minutes</p>
      </div>

      <div className="page-content">
        <section 
          className={`setup-section ${setupSection.isVisible ? 'scroll-animate' : ''}`}
          ref={setupSection.elementRef as React.RefObject<HTMLElement>}
        >
          <h2>Setup in 3 Simple Steps</h2>
          
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Create Your Account</h3>
              <p>Sign up with your email and create a secure password. It only takes a minute!</p>
              <ul>
                <li>Valid email address</li>
                <li>Strong password</li>
                <li>Accept terms & conditions</li>
              </ul>
            </div>

            <div className="step-card">
              <div className="step-number">2</div>
              <h3>Download the App</h3>
              <p>Get our mobile app on iOS or Android to start tracking buses in real-time.</p>
              <div className="app-links">
                <button className="app-button ios">📱 App Store</button>
                <button className="app-button android">🤖 Google Play</button>
              </div>
            </div>

            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Start Tracking</h3>
              <p>Open the app and begin tracking buses, setting alerts, and managing your commute.</p>
              <ul>
                <li>View real-time bus locations</li>
                <li>Get arrival notifications</li>
                <li>Book tickets online</li>
              </ul>
            </div>
          </div>
        </section>

        <section 
          className={`benefits-section ${benefitsSection.isVisible ? 'scroll-animate' : ''}`}
          ref={benefitsSection.elementRef as React.RefObject<HTMLElement>}
        >
          <h2>Why Choose iKomyutPH?</h2>
          <div className="benefits-list">
            <div className="benefit-item">
              <span className="benefit-icon">⚡</span>
              <div>
                <h4>Real-Time Tracking</h4>
                <p>Know exactly where your bus is at any moment with GPS tracking</p>
              </div>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">💳</span>
              <div>
                <h4>Cashless Payments</h4>
                <p>Pay using GCash, Maya, or PayPal - no need for exact change</p>
              </div>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">📬</span>
              <div>
                <h4>Smart Notifications</h4>
                <p>Get alerts about arrivals, delays, and route updates</p>
              </div>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">🔒</span>
              <div>
                <h4>Secure & Safe</h4>
                <p>Your data is encrypted and protected with latest security</p>
              </div>
            </div>
          </div>
        </section>

        <section 
          className={`cta-section ${ctaSection.isVisible ? 'scroll-animate' : ''}`}
          ref={ctaSection.elementRef as React.RefObject<HTMLElement>}
        >
          <h2>Ready to Get Started?</h2>
          <p>Join thousands of commuters already using iKomyutPH</p>
          <button className="btn btn--primary cta-button" onClick={onGoToLogin}>Sign Up Now</button>
        </section>
      </div>
    </div>
  );
};

export default GetStarted;
