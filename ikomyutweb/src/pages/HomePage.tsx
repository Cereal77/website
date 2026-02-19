import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import PaymentModal from '../components/PaymentModal';
import ContactModal from '../components/ContactModal';
import LoginPromptModal from '../components/LoginPromptModal';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

interface HomePageProps {
  onNavigateTo: (page: 'getstarted' | 'learnmore') => void;
  onShowLoginPrompt: () => void;
  onGoToLoginPage: () => void;
  onLogout: () => void;
  showPricingModal: boolean;
  setShowPricingModal: (show: boolean) => void;
  showPaymentModal: boolean;
  setShowPaymentModal: (show: boolean) => void;
  showContactModal: boolean;
  setShowContactModal: (show: boolean) => void;
  showLoginPrompt: boolean;
  setShowLoginPrompt: (show: boolean) => void;
  selectedPlan: { name: string; price: string } | null;
  onSelectPlan: (planName: string, planPrice: string) => void;
  onPaymentSelect: (method: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({
  onNavigateTo,
  onShowLoginPrompt,
  onGoToLoginPage,
  onLogout,
  showPricingModal,
  setShowPricingModal,
  showPaymentModal,
  setShowPaymentModal,
  showContactModal,
  setShowContactModal,
  showLoginPrompt,
  setShowLoginPrompt,
  selectedPlan,
  onSelectPlan,
  onPaymentSelect,
}) => {
  const { isLoggedIn } = useAuth();
  
  // Scroll animation hooks
  const feature1 = useScrollAnimation();
  const feature2 = useScrollAnimation();
  const pricingSection = useScrollAnimation();
  const footerSection = useScrollAnimation();

  const handlePricingClick = (planName: string, planPrice: string) => {
    if (!isLoggedIn) {
      onShowLoginPrompt();
    } else {
      onSelectPlan(planName, planPrice);
    }
  };

  const handleContactClick = () => {
    if (!isLoggedIn) {
      onShowLoginPrompt();
    } else {
      setShowContactModal(true);
    }
  };

  const handleGetStartedClick = () => {
    onNavigateTo('getstarted');
  };

  const handleLearnMoreClick = () => {
    onNavigateTo('learnmore');
  };

  const handleViewPricingClick = () => {
    const pricingSection = document.getElementById('pricing');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Header */}
      <header className="header">
        <div className="header__container">
          <div className="header__logo">
            <img src="/ilogo.png" alt="iKomyutPH" className="header__logo-img" />
            <span className="header__brand">iKomyutPH</span>
          </div>
          <nav className="header__nav">
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <a href="#contact">Contact</a>
          </nav>
          <div className="header__actions">
            {isLoggedIn ? (
              <>
                <button className="header__cta" onClick={handleViewPricingClick}>
                  View Pricing
                </button>
                <button className="header__logout" onClick={onLogout}>
                  Logout
                </button>
              </>
            ) : (
              <button className="header__cta" onClick={onGoToLoginPage}>
                Login / Register
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        {/* Background Map */}
        <div className="hero__bg-map"></div>
        
        {/* Floating Icons */}
        <div className="hero__icon hero__icon--bus-1"><img src="/bus.png" alt="Bus" className="hero__icon-img" /></div>
        <div className="hero__icon hero__icon--bus-2"><img src="/bus.png" alt="Bus" className="hero__icon-img" /></div>
        <div className="hero__icon hero__icon--bus-3"><img src="/bus.png" alt="Bus" className="hero__icon-img" /></div>
        <div className="hero__icon hero__icon--bus-4"><img src="/bus.png" alt="Bus" className="hero__icon-img" /></div>
        <div className="hero__icon hero__icon--bus-5"><img src="/bus.png" alt="Bus" className="hero__icon-img" /></div>
        <div className="hero__icon hero__icon--bus-6"><img src="/bus.png" alt="Bus" className="hero__icon-img" /></div>
        <div className="hero__icon hero__icon--profile"><img src="/personloc.png" alt="Person" className="hero__icon-img" /></div>
        
        <div className="hero__container">
          <div className="hero__content">
            <h1 className="hero__title">iKomyutPH</h1>
            <p className="hero__subtitle">
              iKomyutPH provides an advanced, real-time tracking and ticketing system for both passengers and buses.
            </p>
            <div className="hero__buttons">
              <button className="btn btn--primary" onClick={handleGetStartedClick}>Get Started</button>
              <button className="btn btn--secondary" onClick={handleLearnMoreClick}>Learn More</button>
            </div>
          </div>
          <div className="hero__image">
            <img src="/car.png" alt="iKomyutPH Car" className="hero__car-img" />
          </div>
        </div>
      </section>

      {/* Feature 1: Real-Time Vehicle Tracking */}
      <section 
        id="features" 
        className={`feature ${feature1.isVisible ? 'scroll-animate' : ''}`}
        ref={feature1.elementRef as React.RefObject<HTMLElement>}
      >
        <div className="feature__container">
          <div className="feature__image">
            <img src="/carr.png" alt="Real-Time Vehicle Tracking" className="feature__img" />
          </div>
          <div className="feature__content">
            <h2 className="feature__title">Real-Time Vehicle Tracking</h2>
            <p className="feature__description">
              Track both passengers and buses live on an interactive map. iKomyutPH users GPS-enabled tracking to provide real-time updates, helping commuters know exactly where the bus is and its current parking time. Stay informed with live notifications.
            </p>
            <button className="btn btn--secondary" onClick={handleLearnMoreClick}>Learn More</button>
          </div>
        </div>
      </section>

      {/* Feature 2: Integrated Ticketing System */}
      <section 
        className={`feature ${feature2.isVisible ? 'scroll-animate' : ''}`}
        ref={feature2.elementRef as React.RefObject<HTMLElement>}
      >
        <div className="feature__container">
          <div className="feature__content">
            <h2 className="feature__title">Integrated Ticketing System</h2>
            <p className="feature__description">
              Simplify fare collection with our built-in ticketing solution. Digital payments, automated fare calculation, and driver experience are all included to streamline transactions and reduce cash handling.
            </p>
            <button className="btn btn--secondary" onClick={handleLearnMoreClick}>Learn More</button>
          </div>
          <div className="feature__image">
            <img src="/carrr.png" alt="Integrated Ticketing System" className="feature__img" />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section 
        id="pricing" 
        className={`pricing ${pricingSection.isVisible ? 'scroll-animate' : ''}`}
        ref={pricingSection.elementRef as React.RefObject<HTMLElement>}
      >
        <h2 className="pricing__title">Pricing Plans</h2>
        <div className="pricing__grid">
          {/* Basic Plan */}
          <div className="pricing__card">
            <h3 className="pricing__plan-name">Basic</h3>
            <p className="pricing__price">₱99/month</p>
            <p className="pricing__description">For the basics</p>
            <ul className="pricing__features">
              <li>Real-time bus tracking</li>
              <li>Basic notifications</li>
              <li>Email support</li>
              <li>Mobile app access</li>
            </ul>
            <button className="btn btn--secondary" onClick={() => handlePricingClick('Basic', '₱99/month')}>Choose Plan</button>
          </div>

          {/* Pro Plan */}
          <div className="pricing__card pricing__card--featured">
            <h3 className="pricing__plan-name">Pro</h3>
            <p className="pricing__price">₱299/month</p>
            <p className="pricing__description">Most popular</p>
            <ul className="pricing__features">
              <li>Everything in Basic</li>
              <li>Advanced analytics</li>
              <li>Priority support</li>
              <li>Custom alerts</li>
              <li>Driver communication</li>
            </ul>
            <button className="btn btn--primary" onClick={() => handlePricingClick('Pro', '₱299/month')}>Choose Plan</button>
          </div>

          {/* Enterprise Plan */}
          <div className="pricing__card">
            <h3 className="pricing__plan-name">Enterprise</h3>
            <p className="pricing__price">Custom</p>
            <p className="pricing__description">For large operations</p>
            <ul className="pricing__features">
              <li>Everything in Pro</li>
              <li>Custom integrations</li>
              <li>24/7 dedicated support</li>
              <li>API access</li>
              <li>White-label options</li>
            </ul>
            <button className="btn btn--secondary" onClick={handleContactClick}>Contact Us</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer 
        className={`footer ${footerSection.isVisible ? 'scroll-animate' : ''}`}
        ref={footerSection.elementRef as React.RefObject<HTMLElement>}
      >
        <div className="footer__container">
          <div className="footer__section">
            <div className="footer__brand">
              <img src="/ilogo.png" alt="iKomyutPH" className="footer__logo-img" />
              <span>iKomyutPH</span>
            </div>
            <p>Advanced real-time tracking and ticketing system for buses and passengers.</p>
            <div className="footer__socials">
              <a href="#" className="footer__social">f</a>
              <a href="#" className="footer__social">𝕏</a>
              <a href="#" className="footer__social">☎</a>
            </div>
          </div>
          <div className="footer__section">
            <h5>Quick Links</h5>
            <ul className="footer__links">
              <li><a href="#features">Features</a></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><a href="#contact">Contact</a></li>
              <li><a href="#">FAQ</a></li>
            </ul>
          </div>
          <div className="footer__section" id="contact">
            <h5>Contact Us</h5>
            <p>Have questions? Reach out and we'll get back to you!</p>
            <button className="btn btn--primary" onClick={handleContactClick}>Send us a Message</button>
          </div>
        </div>
        <div className="footer__bottom">
          <p>&copy; 2024 iKomyutPH. All rights reserved.</p>
        </div>
      </footer>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        planName={selectedPlan?.name || ''}
        planPrice={selectedPlan?.price || ''}
        onClose={() => setShowPaymentModal(false)}
        onPaymentSelect={onPaymentSelect}
      />

      {/* Contact Modal */}
      <ContactModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
      />

      {/* Login Prompt Modal */}
      <LoginPromptModal 
        isOpen={showLoginPrompt && !isLoggedIn} 
        onLoginClick={onGoToLoginPage}
        onClose={() => setShowLoginPrompt(false)}
      />
    </>
  );
};

export default HomePage;
