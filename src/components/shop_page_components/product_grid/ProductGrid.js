import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ProductGrid.css';
import { useWishlist } from '../../../context/WishlistContext';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';

const ProductGrid = ({ products }) => {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const { showSuccess, showInfo } = useToast();
  const navigate = useNavigate();

  const handleWishlistToggle = (product) => {
    if (!isAuthenticated) {
      showInfo('You need to create an account to add items to your favorites!', 4000);
      // Navigate to signup page after a short delay to let user see the toast
      setTimeout(() => {
        navigate('/auth');
      }, 1500);
      return;
    }
    
    const wasAdded = toggleWishlist(product);
    const message = wasAdded ? 'Added to wishlist!' : 'Removed from wishlist!';
    showSuccess(message);
  };

  return (
    <div className="product-grid">
      {products.map(product => (
        <div className="product-card" key={product.id}>
          <Link to={`/product/${product.id}`} className="product-link">
          <div className="product-image-container">
            <img src={product.image} alt={product.name} className="product-image" />
            <button
              className={`wishlist-btn ${isInWishlist(product.id) ? 'active' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                handleWishlistToggle(product);
              }}
            >
              <img src="/icons/heart-icon.svg" alt="Add to Wishlist" />
            </button>
          </div>
          </Link>
          <div className="product-info">
            <Link to={`/product/${product.id}`} className="product-link">
            <h3 className="product-name">{product.name}</h3>
            <div className="product-price">${product.price.toFixed(2)} USD</div>
            </Link>
            <div className="product-colors">
              {product.colors.map((color, index) => (
                <div 
                  key={index} 
                  className="color-circle" 
                  style={{ 
                    backgroundColor: color === 'pink' ? '#FFB6C1' : 
                                     color === 'navy' ? '#000080' : 
                                     color === 'red' ? '#FF0000' : 
                                     color === 'white' ? '#FFFFFF' : color 
                  }}
                >
                  {color === 'white' && <div className="white-border"></div>}
                </div>
              ))}
              {product.colors.length > 4 && <span className="more-colors">+{product.colors.length - 4}</span>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
