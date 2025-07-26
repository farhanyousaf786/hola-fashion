import React from 'react';
import { Link } from 'react-router-dom';
import './BottomHeader.css';

const BottomHeader = () => {
  return (
    <nav className="bottom-header">
      <ul className="nav-menu">
        <li className="dropdown-item">
          <a href="#prom">PROM <img src="/icons/dropdown-arrow.svg" alt="" className="dropdown-arrow" /></a>
        </li>
        <li className="dropdown-item">
          <a href="#hoco">HOCO <img src="/icons/dropdown-arrow.svg" alt="" className="dropdown-arrow" /></a>
        </li>
        <li className="dropdown-item">
          <Link to="/wedding">WEDDING <img src="/icons/dropdown-arrow.svg" alt="" className="dropdown-arrow" /></Link>
        </li>
        <li className="dropdown-item">
          <a href="#wedding-guest">WEDDING GUEST <img src="/icons/dropdown-arrow.svg" alt="" className="dropdown-arrow" /></a>
        </li>
        <li className="dropdown-item">
          <a href="#bridesmaid">BRIDESMAID <img src="/icons/dropdown-arrow.svg" alt="" className="dropdown-arrow" /></a>
        </li>
        <li className="dropdown-item">
          <a href="#mother-of-bride">MOTHER OF BRIDE <img src="/icons/dropdown-arrow.svg" alt="" className="dropdown-arrow" /></a>
        </li>
        <li className="dropdown-item">
          <a href="#quince">QUINCE <img src="/icons/dropdown-arrow.svg" alt="" className="dropdown-arrow" /></a>
        </li>
        <li className="dropdown-item">
          <a href="#formal">FORMAL <img src="/icons/dropdown-arrow.svg" alt="" className="dropdown-arrow" /></a>
        </li>
        <li className="dropdown-item">
          <a href="#others">OTHERS <img src="/icons/dropdown-arrow.svg" alt="" className="dropdown-arrow" /></a>
        </li>
      </ul>
      <div className="user-actions">
        <a href="#account" className="account-link">
          <img src="/icons/profile-icon.svg" alt="Profile" className="action-icon" />
        </a>
        <a href="#wishlist" className="wishlist-link">
          <img src="/icons/heart-icon.svg" alt="Wishlist" className="action-icon" />
        </a>
        <a href="#cart" className="cart-link">
          <img src="/icons/cart-icon.svg" alt="Cart" className="action-icon" />
        </a>
      </div>
    </nav>
  );
};

export default BottomHeader;
