import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './MiddleHeader.css';

const MiddleHeader = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Navigate to shop page with search query
      navigate(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  // Prevent iOS zoom on input focus
  const handleInputFocus = (e) => {
    if (window.innerWidth <= 768) {
      e.target.style.fontSize = '16px';
    }
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    // Always scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Navigate home only if not already on home
    if (location.pathname !== '/') {
      navigate('/');
    }
  };

  return (
    <div className="middle-header">
      {/* currency selector removed */}
      
      <div className="logo-container">
        <Link to="/" className="logo-link" onClick={handleLogoClick}>
          <h1 className="site-logo">Rallina</h1>
        </Link>
      </div>
      
      <form className="search-container" onSubmit={handleSearch}>
        <input 
          type="text" 
          placeholder="Search products, categories..." 
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
          onFocus={handleInputFocus}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        />
        <button type="submit" className="search-btn">SEARCH</button>
      </form>
    </div>
  );
};

export default MiddleHeader;
