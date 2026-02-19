import React from 'react';
import './Header.css';

const Header = () => (
  <header className="header">
    <div className="header__logo">
      <img src="/logo192.png" alt="iKomyutPH Logo" className="header__logo-img" />
      <span className="header__brand">iKomyutPH</span>
    </div>
    <nav className="header__nav">
      <a href="#features">Features</a>
      <a href="#pricing">Pricing</a>
      <a href="#contact">Contact</a>
    </nav>
    <a href="#get-started" className="header__cta">Get Started</a>
  </header>
);

export default Header;
