import React from 'react';
import './MiddleHeader.css';

const MiddleHeader = () => {
  return (
    <div className="middle-header">
      <div className="currency-selector">
        <button className="currency-btn">
          <img src="/images/us-flag.png" alt="US Flag" className="flag-icon" />
          USD
        </button>
      </div>
      
      <div className="logo-container">
        <h1 className="site-logo">Hola Fashion</h1>
      </div>
      
      <div className="search-container">
        <input type="text" placeholder="Search" className="search-input" />
        <button className="search-btn">SEARCH</button>
      </div>
    </div>
  );
};

export default MiddleHeader;
