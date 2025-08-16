import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './BottomHeader.css';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../context/AuthContext';
import { useWishlist } from '../../../context/WishlistContext';

const BottomHeader = () => {
  const { getCartItemCount } = useCart();
  const { isAuthenticated } = useAuth();
  const { getWishlistCount } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

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
        <li className="nav-item">
          <Link to="/prom" className={location.pathname === '/prom' ? 'active' : ''}>PROM</Link>
        </li>
        <li className="nav-item">
          <Link to="/hoco" className={location.pathname === '/hoco' ? 'active' : ''}>HOCO</Link>
        </li>
        <li className="nav-item">
          <Link to="/wedding" className={location.pathname === '/wedding' ? 'active' : ''}>WEDDING</Link>
        </li>
        <li className="nav-item">
          <Link to="/wedding-guest" className={location.pathname === '/wedding-guest' ? 'active' : ''}>WEDDING GUEST</Link>
        </li>
        <li className="nav-item">
          <Link to="/bridesmaid" className={location.pathname === '/bridesmaid' ? 'active' : ''}>BRIDESMAID</Link>
        </li>
        <li className="nav-item">
          <Link to="/mother-of-bride" className={location.pathname === '/mother-of-bride' ? 'active' : ''}>MOTHER OF BRIDE</Link>
        </li>
        <li className="nav-item">
          <Link to="/quince" className={location.pathname === '/quince' ? 'active' : ''}>QUINCE</Link>
        </li>
        <li className="nav-item">
          <Link to="/formal" className={location.pathname === '/formal' ? 'active' : ''}>FORMAL</Link>
        </li>
        <li className="nav-item">
          <Link to="/others" className={location.pathname === '/others' ? 'active' : ''}>OTHERS</Link>
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
