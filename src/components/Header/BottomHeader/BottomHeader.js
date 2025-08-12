import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './BottomHeader.css';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../context/AuthContext';
import { useWishlist } from '../../../context/WishlistContext';

const BottomHeader = () => {
  const { getCartItemCount } = useCart();
  const { isAuthenticated } = useAuth();
  const { getWishlistCount } = useWishlist();
  const navigate = useNavigate();

  const handleWishlistClick = (e) => {
    if (!isAuthenticated) {
      e.preventDefault();
      navigate('/auth?from=wishlist&action=favorite');
    }
  };

  const handleProfileClick = (e) => {
    if (!isAuthenticated) {
      e.preventDefault();
      navigate('/auth?from=profile');
    }
  };

  return (
    <nav className="bottom-header">
      <ul className="nav-menu">
        <li className="dropdown-item">
          <Link to="/prom">PROM <img src="/icons/dropdown-arrow.svg" alt="" className="dropdown-arrow" /></Link>
        </li>
        <li className="dropdown-item">
          <Link to="/hoco">HOCO <img src="/icons/dropdown-arrow.svg" alt="" className="dropdown-arrow" /></Link>
        </li>
        <li className="dropdown-item">
          <Link to="/wedding">WEDDING <img src="/icons/dropdown-arrow.svg" alt="" className="dropdown-arrow" /></Link>
        </li>
        <li className="dropdown-item">
          <Link to="/wedding-guest">WEDDING GUEST <img src="/icons/dropdown-arrow.svg" alt="" className="dropdown-arrow" /></Link>
        </li>
        <li className="dropdown-item">
          <Link to="/bridesmaid">BRIDESMAID <img src="/icons/dropdown-arrow.svg" alt="" className="dropdown-arrow" /></Link>
        </li>
        <li className="dropdown-item">
          <Link to="/mother-of-bride">MOTHER OF BRIDE <img src="/icons/dropdown-arrow.svg" alt="" className="dropdown-arrow" /></Link>
        </li>
        <li className="dropdown-item">
          <Link to="/quince">QUINCE <img src="/icons/dropdown-arrow.svg" alt="" className="dropdown-arrow" /></Link>
        </li>
        <li className="dropdown-item">
          <Link to="/formal">FORMAL <img src="/icons/dropdown-arrow.svg" alt="" className="dropdown-arrow" /></Link>
        </li>
        <li className="dropdown-item">
          <Link to="/others">OTHERS <img src="/icons/dropdown-arrow.svg" alt="" className="dropdown-arrow" /></Link>
        </li>
      </ul>
      <div className="user-actions">
        <Link to="/profile" className="account-link" onClick={handleProfileClick}>
          <img src="/icons/profile-icon.svg" alt="Profile" className="action-icon" />
        </Link>
        <Link to="/wishlist" className="wishlist-link" onClick={handleWishlistClick}>
          <img src="/icons/heart-icon.svg" alt="Wishlist" className="action-icon" />
          {isAuthenticated && getWishlistCount() > 0 && (
            <span className="wishlist-count">{getWishlistCount()}</span>
          )}
        </Link>
        <Link to="/cart" className="cart-link">
          <img src="/icons/cart-icon.svg" alt="Cart" className="action-icon" />
          {getCartItemCount() > 0 && (
            <span className="cart-count">{getCartItemCount()}</span>
          )}
        </Link>
      </div>
    </nav>
  );
};

export default BottomHeader;
