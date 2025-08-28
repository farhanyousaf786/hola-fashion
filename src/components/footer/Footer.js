import React, { useState } from 'react';
import './Footer.css';

const Footer = () => {
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');

  const handleAskSubmit = (e) => {
    e.preventDefault();
    // TODO: wire this up to backend/email if desired
    console.log('Footer question submitted:', {
      name: contactName,
      email: contactEmail,
      comment: contactMessage,
    });
    alert('Thanks! Your question has been sent.');
    setContactName('');
    setContactEmail('');
    setContactMessage('');
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-left">
            <h2 className="brand-mark">Rallina</h2>
            <div className="footer-columns">
              <div className="footer-section">
                <h3 className="footer-title">Policies & Help</h3>
                <ul className="footer-links">
                  <li><a href="/privacy-policy">Privacy Policy</a></li>
                  <li><a href="/terms-conditions">Terms & Conditions</a></li>
                  <li><a href="/shipping-policy">Shipping Policy</a></li>
                  <li><a href="/return-policy">Return Policy</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="footer-right">
            <div className="contact-form-header">
              <h3 className="footer-title">Ask a question</h3>
            </div>
            <form className="contact-form" onSubmit={handleAskSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  className="contact-input"
                  placeholder="Your name"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="email"
                  className="contact-input"
                  placeholder="Your email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <textarea
                  className="contact-textarea"
                  placeholder="Your comment"
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  required
                />
              </div>
              <button className="send-query-btn" type="submit">Send</button>
            </form>
          </div>
        </div>
      </div>

      <div className="footer-social">
        <div className="social-header">
          <h3 className="social-title">FOLLOW US</h3>
          <a href="mailto:support@rallina.com" className="social-email" aria-label="Email support@rallina.com">
            <span className="email-icon">✉️</span>
            support@rallina.com
          </a>
        </div>
        <div className="social-icons">
          <a href="https://facebook.com/rallina" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="social-link facebook">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </a>
          <a href="https://instagram.com/rallina" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="social-link instagram">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>
        </div>
      </div>

      <div className="footer-copyright">
        <p>Copyright © 2025 Designed and Developed By Techenex.</p>
      </div>
    </footer>
  );
};

export default Footer;
