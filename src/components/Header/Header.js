import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import TopHeader from './TopHeader/TopHeader';
import MiddleHeader from './MiddleHeader/MiddleHeader';
import BottomHeader from './BottomHeader/BottomHeader';
import { useCart } from '../../context/CartContext';

const Header = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { getCartItemCount } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    const handleClickOutside = (event) => {
      if (mobileMenuOpen && !event.target.closest('.mobile-menu') && !event.target.closest('.hamburger-menu')) {
        setMobileMenuOpen(false);
      }
      if (mobileSearchOpen && !event.target.closest('.mobile-search') && !event.target.closest('.search-link')) {
        setMobileSearchOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [mobileMenuOpen, mobileSearchOpen]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    setMobileSearchOpen(false); // Close search when menu opens
  };

  const toggleMobileSearch = () => {
    setMobileSearchOpen(!mobileSearchOpen);
    setMobileMenuOpen(false); // Close menu when search opens
  };

  const handleMobileSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
      setMobileSearchOpen(false);
      setSearchTerm('');
    }
  };

  const handleCartClick = () => {
    navigate('/cart');
  };

  const handleMenuItemClick = (path) => {
    navigate(path);
    setMobileMenuOpen(false); // Close menu after navigation
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
                <Link to="/" className="logo-link">
                  <h1 className="site-logo">K</h1>
                </Link>
              </div>
              
              <div className="mobile-actions">
                <button onClick={toggleMobileSearch} className="search-link">
                  <img src="/icons/search-icon.svg" alt="Search" className="action-icon" />
                </button>
                <button onClick={handleCartClick} className="cart-link">
                  <img src="/icons/cart-icon.svg" alt="Cart" className="action-icon" />
                  {getCartItemCount() > 0 && (
                    <span className="cart-count">{getCartItemCount()}</span>
                  )}
                </button>
              </div>
            </div>
            
            {mobileSearchOpen && (
              <div className="mobile-search">
                <form onSubmit={handleMobileSearch} className="mobile-search-form">
                  <input
                    type="text"
                    placeholder="Search products, categories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mobile-search-input"
                    autoFocus
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                  />
                  <button type="submit" className="mobile-search-submit">
                    Search
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setMobileSearchOpen(false)}
                    className="mobile-search-close"
                  >
                    ×
                  </button>
                </form>
              </div>
            )}
            
            {mobileMenuOpen && (
              <div className="mobile-menu">
                <div className="mobile-nav">
                  <ul className="mobile-nav-menu">
                    <li><button onClick={() => handleMenuItemClick('/prom')}>PROM</button></li>
                    <li><button onClick={() => handleMenuItemClick('/hoco')}>HOCO</button></li>
                    <li><button onClick={() => handleMenuItemClick('/wedding')}>WEDDING</button></li>
                    <li><button onClick={() => handleMenuItemClick('/wedding-guest')}>WEDDING GUEST</button></li>
                    <li><button onClick={() => handleMenuItemClick('/bridesmaid')}>BRIDESMAID</button></li>
                    <li><button onClick={() => handleMenuItemClick('/mother-of-bride')}>MOTHER OF BRIDE</button></li>
                    <li><button onClick={() => handleMenuItemClick('/quince')}>QUINCE</button></li>
                    <li><button onClick={() => handleMenuItemClick('/formal')}>FORMAL</button></li>
                    <li><button onClick={() => handleMenuItemClick('/others')}>OTHERS</button></li>
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