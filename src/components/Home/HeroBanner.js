import React from 'react';
import './HeroBanner.css';

const HeroBanner = () => {
  return (
    <div className="hero-banner">
      <div className="hero-content">
        <h2 className="hero-title">Hola Fashion</h2>
        <h3 className="hero-subtitle">Your Fashion.</h3>
        <h3 className="hero-subtitle">Your Style.</h3>
        <div className="customer-reviews">
          <div className="customer-avatars">
            {/* These would be actual customer images in a real implementation */}
            <div className="avatar"></div>
            <div className="avatar"></div>
            <div className="avatar"></div>
            <div className="avatar"></div>
            <div className="avatar"></div>
          </div>
          <p className="review-text">1000+ happy customers</p>
        </div>
      </div>
      <div className="hero-image">
        {/* This would be replaced with an actual image in production */}
        <img src="/images/hero-fashion.jpg" alt="Fashion models wearing stylish outfits" />
      </div>
    </div>
  );
};

export default HeroBanner;
