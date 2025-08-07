import React, { useState } from 'react';
import './Footer.css';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter signup
    console.log('Newsletter signup:', email);
    setEmail('');
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3 className="footer-title">CUSTOMER CARE</h3>
          <ul className="footer-links">
            <li><a href="/contact">Contact Us</a></li>
            <li><a href="/ordering">Ordering</a></li>
            <li><a href="/coupons">Coupons and Promotions</a></li>
            <li><a href="/shipping">Shipping and Processing Information</a></li>
            <li><a href="/returns">Returns and Exchanges</a></li>
            <li><a href="/reviews">Customer Reviews</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">INFORMATION</h3>
          <ul className="footer-links">
            <li><a href="/track-order">Track an order</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/blogs">Blogs</a></li>
            <li><a href="/career">Career</a></li>
            <li><a href="/how-to-shop">How to Shop</a></li>
            <li><a href="/affiliates">Affiliates</a></li>
            <li><a href="/privacy-policy">Privacy Policy</a></li>
            <li><a href="/copyright">Copyright Information</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">EXPLORE</h3>
          <ul className="footer-links">
            <li><a href="/prom-dresses">Prom Dresses</a></li>
            <li><a href="/mob-dresses">MOB Dresses</a></li>
            <li><a href="/formal-dresses">Formal Dresses</a></li>
            <li><a href="/plus-size-dresses">Plus Size Dresses</a></li>
            <li><a href="/evening-dresses">Evening Dresses</a></li>
            <li><a href="/homecoming-dresses">Homecoming Dresses</a></li>
            <li><a href="/new-years-eve-dresses">New Years Eve Dresses</a></li>
            <li><a href="/holiday-dresses">Holiday Dresses</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">CONNECT WITH US</h3>
          <div className="contact-info">
            <p className="address">
              <i className="location-icon">📍</i> 4050 W. Sunset Rd, Suite H - Dock Door 25, Las Vegas, NV - 89118 USA
            </p>
            <p className="email">
              <i className="email-icon">✉️</i> cs@couturecandy.com
            </p>
            <p className="phone">
              <i className="phone-icon">📞</i> (855) 445-8601
            </p>
          </div>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">NEWSLETTER</h3>
          <form className="newsletter-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <input 
                type="email" 
                placeholder="Email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
              <button type="submit" className="signup-btn">SIGN UP</button>
            </div>
          </form>
          <p className="newsletter-text">
            Subscribe to receive updates, exclusive deals, and more.
          </p>
          <div className="terms-privacy">
            <img src="/images/demo-image.png" alt="Trust Badge" className="trust-badge" />
            <p>
              By using this site you agree to our Terms & Conditions of Use and Privacy Statement.
            </p>
          </div>
        </div>
      </div>

      <div className="footer-social">
        <h3 className="social-title">FOLLOW US</h3>
        <div className="social-icons">
          <a href="https://facebook.com" aria-label="Facebook"><i className="social-icon">f</i></a>
          <a href="https://twitter.com" aria-label="Twitter"><i className="social-icon">t</i></a>
          <a href="https://pinterest.com" aria-label="Pinterest"><i className="social-icon">p</i></a>
          <a href="https://instagram.com" aria-label="Instagram"><i className="social-icon">i</i></a>
        </div>
      </div>

      <div className="footer-badges">
        <div className="badge-container">
          <img src="/images/demo-image.png" alt="America's Best Online Shops" className="badge" />
          <img src="/images/demo-image.png" alt="BBB Accredited Business" className="badge" />
          <img src="/images/demo-image.png" alt="Secure Shopping" className="badge" />
        </div>
      </div>

      <div className="footer-copyright">
        <p>Copyright © 2025 Designed and Developed By Rallina.</p>
        <div className="payment-methods">
          <img src="/images/demo-image.png" alt="Visa" className="payment-icon" />
          <img src="/images/demo-image.png" alt="American Express" className="payment-icon" />
          <img src="/images/demo-image.png" alt="Mastercard" className="payment-icon" />
          <img src="/images/demo-image.png" alt="Discover" className="payment-icon" />
          <img src="/images/demo-image.png" alt="Apple Pay" className="payment-icon" />
          <img src="/images/demo-image.png" alt="PayPal" className="payment-icon" />
          <img src="/images/demo-image.png" alt="Sezzle" className="payment-icon" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
