import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import TopHeader from './TopHeader/TopHeader';
import MiddleHeader from './MiddleHeader/MiddleHeader';
import BottomHeader from './BottomHeader/BottomHeader';
import { useCart } from '../../context/CartContext';

const Header = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { getCartItemCount } = useCart();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="site-header">
      {isMobile ? (
        <>
          <div className="top-header">
            <div className="announcement">
              <p>AVOID UP TO 25% PRICE INCREASES NEXT MONTH - SHOP PRE-TARIFF DRESSES TODAY!</p>
            </div>
          </div>
          <div className="mobile-header">
            <div className="mobile-user-bar">
              <div className="currency-selector">
                <img src="/icons/flag-icon.svg" alt="US Flag" className="flag-icon" />
                <span>USD</span>
                <span className="dropdown-arrow">▼</span>
              </div>
              
              <div className="user-icons">
                <a href="#account">
                  <img src="/icons/profile-icon.svg" alt="Profile" className="user-icon" />
                </a>
               
                <a href="#contact">
                  <img src="/icons/email-icon.svg" alt="Email" className="user-icon" />
                </a>
                <a href="#call">
                  <img src="/icons/phone-icon.svg" alt="Phone" className="user-icon" />
                </a>
              </div>
            </div>
            
            <div className="mobile-header-top">
              <button className="hamburger-menu" onClick={toggleMobileMenu}>
                <img src="/icons/hamburger-menu.svg" alt="Menu" />
              </button>
              
              <div className="logo-container">
                <h1 className="site-logo">HF</h1>
              </div>
              
              <div className="mobile-actions">
                <a href="#search" className="search-link">
                  <img src="/icons/search-icon.svg" alt="Search" className="action-icon" />
                </a>
                <a href="#cart" className="cart-link">
                  <img src="/icons/cart-icon.svg" alt="Cart" className="action-icon" />
                  {getCartItemCount() > 0 && (
                    <span className="cart-count">{getCartItemCount()}</span>
                  )}
                </a>
              </div>
            </div>
            
            {mobileMenuOpen && (
              <div className="mobile-menu">
                <div className="mobile-nav">
                  <ul className="mobile-nav-menu">
                    <li><a href="#prom">PROM</a></li>
                    <li><a href="#hoco">HOCO</a></li>
                    <li><Link to="/wedding">WEDDING</Link></li>
                    <li><a href="#wedding-guest">WEDDING GUEST</a></li>
                    <li><a href="#bridesmaid">BRIDESMAID</a></li>
                    <li><a href="#mother-of-bride">MOTHER OF BRIDE</a></li>
                    <li><a href="#quince">QUINCE</a></li>
                    <li><a href="#formal">FORMAL</a></li>
                    <li><a href="#others">OTHERS</a></li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <TopHeader />
          <MiddleHeader />
          <BottomHeader />
        </>
      )}
    </header>
  );
};

export default Header;