import React from 'react';
import '../styles/LearnMore.css';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

interface LearnMoreProps {
  onBack: () => void;
  onGoToLogin?: () => void;
}

const LearnMore: React.FC<LearnMoreProps> = ({ onBack, onGoToLogin }) => {
  const featureSection = useScrollAnimation();
  const faqSection = useScrollAnimation();
  const statsSection = useScrollAnimation();

  return (
    <div className="page-container">
      <div className="page-header">
        <button className="back-button" onClick={onBack}>← Back</button>
        <h1>Learn More About iKomyutPH</h1>
        <p>Discover the features that make your commute easier</p>
      </div>

      <div className="page-content">
        <section 
          className={`feature-section ${featureSection.isVisible ? 'scroll-animate' : ''}`}
          ref={featureSection.elementRef as React.RefObject<HTMLElement>}
        >
          <h2>Our Features</h2>
          
          <div className="feature-detailed">
            <div className="feature-content">
              <h3>📍 Real-Time Bus Tracking</h3>
              <p>
                Track buses live on an interactive map. Get GPS-enabled real-time updates showing exactly 
                where the bus is and how long until it arrives. Never wait unnecessarily again.
              </p>
              <ul>
                <li>Live GPS location updates every 10 seconds</li>
                <li>Estimated arrival times</li>
                <li>Route visualization on map</li>
                <li>Multiple bus tracking</li>
              </ul>
            </div>
            <div className="feature-image">
              <img src="/carr.png" alt="Bus Tracking" />
            </div>
          </div>

          <div className="feature-detailed reverse">
            <div className="feature-image">
              <img src="/carrr.png" alt="Ticketing System" />
            </div>
            <div className="feature-content">
              <h3>🎫 Integrated Ticketing System</h3>
              <p>
                Simplify fare collection with our digital ticketing solution. Say goodbye to cash handling 
                and enjoy seamless, automated transactions.
              </p>
              <ul>
                <li>Digital ticket purchases</li>
                <li>Automated fare calculation</li>
                <li>Multiple payment methods</li>
                <li>Transaction history tracking</li>
              </ul>
            </div>
          </div>

          <div className="feature-detailed">
            <div className="feature-content">
              <h3>🔔 Smart Notifications</h3>
              <p>
                Stay informed with intelligent notifications about bus arrivals, delays, route changes, 
                and special announcements.
              </p>
              <ul>
                <li>Custom alert preferences</li>
                <li>Arrival notifications</li>
                <li>Delay alerts</li>
                <li>Service announcements</li>
              </ul>
            </div>
          </div>
        </section>

        <section 
          className={`faq-section ${faqSection.isVisible ? 'scroll-animate' : ''}`}
          ref={faqSection.elementRef as React.RefObject<HTMLElement>}
        >
          <h2>Frequently Asked Questions</h2>
          <div className="faq-items">
            <div className="faq-item">
              <h4>Is iKomyutPH available on all devices?</h4>
              <p>Yes, our app works on both iOS and Android. We also have a web version for desktop users.</p>
            </div>
            <div className="faq-item">
              <h4>Is my data secure?</h4>
              <p>Absolutely! We use military-grade encryption and comply with international data protection standards.</p>
            </div>
            <div className="faq-item">
              <h4>What payment methods are supported?</h4>
              <p>We support GCash, Maya, PayPal, and credit/debit cards for maximum convenience.</p>
            </div>
            <div className="faq-item">
              <h4>Can I refund my ticket?</h4>
              <p>Yes, refunds are available up to 2 hours before departure with a small processing fee.</p>
            </div>
          </div>
        </section>

        <section 
          className={`stats-section ${statsSection.isVisible ? 'scroll-animate' : ''}`}
          ref={statsSection.elementRef as React.RefObject<HTMLElement>}
        >
          <h2>Join Our Community</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>50K+</h3>
              <p>Active Users</p>
            </div>
            <div className="stat-card">
              <h3>200+</h3>
              <p>Bus Routes</p>
            </div>
            <div className="stat-card">
              <h3>1M+</h3>
              <p>Trips Tracked</p>
            </div>
            <div className="stat-card">
              <h3>99.9%</h3>
              <p>Uptime</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LearnMore;
