import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './MiddleHeader.css';

const MiddleHeader = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

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

  return (
    <div className="middle-header">
      <div className="currency-selector">
        <button className="currency-btn">
          <img src="/icons/flag-icon.svg" alt="US Flag" className="flag-icon" />
          USD
          <span className="dropdown-arrow">▼</span>
        </button>
      </div>
      
      <div className="logo-container">
        <Link to="/" className="logo-link">
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
