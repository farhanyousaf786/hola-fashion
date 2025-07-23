import React from 'react';
import './TopHeader.css';

const TopHeader = () => {
  return (
    <div className="top-header">
      <div className="social-icons">
        <a href="#" className="social-icon facebook">
          <img src="/icons/fb-icon.svg" alt="Facebook" className="social-icon-img" />
        </a>
        <a href="#" className="social-icon twitter">
          <img src="/icons/x-icon.svg" alt="X" className="social-icon-img" />
        </a>
        <a href="#" className="social-icon instagram">
          <img src="/icons/insta-icon.svg" alt="Instagram" className="social-icon-img" />
        </a>
        <a href="#" className="social-icon email">
          <img src="/icons/email-icon.svg" alt="Email" className="social-icon-img" />
        </a>
      </div>
      <div className="announcement">
        <p>AVOID UP TO 25% PRICE INCREASES NEXT MONTH - SHOP PRE-TARIFF DRESSES TODAY!</p>
      </div>
      <div className="contact-info">
        <a href="tel:+18554458001">(855) 445-8001</a>
      </div>
    </div>
  );
};

export default TopHeader;
