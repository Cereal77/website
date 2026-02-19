import React, { useState } from 'react';
import './App.css';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import GetStarted from './pages/GetStarted';
import LearnMore from './pages/LearnMore';
import ConfirmationModal from './components/ConfirmationModal';
import SuccessModal from './components/SuccessModal';
import LoadingSpinner from './components/LoadingSpinner';

const AppContent: React.FC = () => {
  const { isLoggedIn, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState<'home' | 'getstarted' | 'learnmore'>('home');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showLoginPage, setShowLoginPage] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{ name: string; price: string } | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);

  const handleGoToLogin = () => {
    setShowLoginPrompt(false);
    setShowLoginPage(true);
  };

  const handleLoginSuccess = () => {
    setShowLoginPage(false);
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleConfirmLogout = () => {
    setIsLoggingOut(true);
    
    // Simulate logout process with delay
    setTimeout(() => {
      setShowLogoutConfirm(false);
      setShowPaymentModal(false);
      logout();
      setIsLoggingOut(false);
      setCurrentPage('home');
    }, 1500);
  };

  const handleSelectPlan = (planName: string, planPrice: string) => {
    setSelectedPlan({ name: planName, price: planPrice });
    setShowPaymentModal(true);
  };

  const handlePaymentSelect = (method: string) => {
    setSelectedPaymentMethod(method);
    setShowPaymentModal(false);
    setShowSuccessModal(true);
  };

  if (showLoginPage) {
    return (
      <AuthPage
        onAuthSuccess={handleLoginSuccess}
      />
    );
  }

  if (currentPage === 'getstarted') {
    return <GetStarted onBack={() => setCurrentPage('home')} onGoToLogin={handleGoToLogin} />;
  }

  if (currentPage === 'learnmore') {
    return <LearnMore onBack={() => setCurrentPage('home')} onGoToLogin={handleGoToLogin} />;
  }

  return (
    <div className="app">
      <HomePage
        onNavigateTo={(page) => setCurrentPage(page)}
        onShowLoginPrompt={() => setShowLoginPrompt(true)}
        onGoToLoginPage={handleGoToLogin}
        onLogout={handleLogoutClick}
        showPricingModal={false}
        setShowPricingModal={() => {}}
        showPaymentModal={showPaymentModal}
        setShowPaymentModal={setShowPaymentModal}
        showContactModal={showContactModal}
        setShowContactModal={setShowContactModal}
        showLoginPrompt={showLoginPrompt}
        setShowLoginPrompt={setShowLoginPrompt}
        selectedPlan={selectedPlan}
        onSelectPlan={handleSelectPlan}
        onPaymentSelect={handlePaymentSelect}
      />

      {/* Logout Confirmation Modal */}
      <ConfirmationModal
        isOpen={showLogoutConfirm}
        title="Logout"
        message="Are you sure you want to logout?"
        confirmText="Logout"
        cancelText="Stay"
        onConfirm={handleConfirmLogout}
        onCancel={() => setShowLogoutConfirm(false)}
        isDangerous={true}
      />

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        message={`Your subscription to the ${selectedPlan?.name} plan is confirmed!`}
        planName={selectedPlan?.name}
        paymentMethod={selectedPaymentMethod || ''}
        onClose={() => setShowSuccessModal(false)}
      />

      {/* Loading Spinner */}
      <LoadingSpinner 
        isVisible={isLoggingOut} 
        message="Logging out..." 
      />
    </div>
  );
};

const App: React.FC = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default App;
