import React from 'react';
import './HeroBanner.css';

const HeroBanner = () => {
  return (
    <div className="hero-banner">
      <div className="hero-content">
        <h2 className="hero-title">Rallina</h2>
        <h3 className="hero-subtitle">Your Fashion.</h3>
        <h3 className="hero-subtitle">Your Style.</h3>
        <div className="customer-reviews">
          <div className="customer-avatars">
            <div className="avatar"><img src="/images/demo-image.png" alt="Customer" /></div>
            <div className="avatar"><img src="/images/demo-image.png" alt="Customer" /></div>
            <div className="avatar"><img src="/images/demo-image.png" alt="Customer" /></div>
            <div className="avatar"><img src="/images/demo-image.png" alt="Customer" /></div>
            <div className="avatar"><img src="/images/demo-image.png" alt="Customer" /></div>
          </div>
          <p className="review-text">1000+ happy customers</p>
        </div>
      </div>
      <div className="hero-image">
        <img src="/images/demo-image.png" alt="Fashion showcase" className="demo-image" />
      </div>
    </div>
  );
};

export default HeroBanner;
