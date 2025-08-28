import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ProductGrid.css';
import { useWishlist } from '../../../context/WishlistContext';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import LoginPromptModal from '../../common/LoginPromptModal/LoginPromptModal';

const ProductGrid = ({ products }) => {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();
  const [loginPromptOpen, setLoginPromptOpen] = useState(false);

  const handleWishlistToggle = async (product) => {
    if (!isAuthenticated) {
      setLoginPromptOpen(true);
      return;
    }
    const result = await toggleWishlist(product);
    if (result === true) {
      showSuccess('Added to wishlist!');
    } else if (result === false) {
      // If it was in the list, toggle returns false (removed). If add failed, WishlistContext shows an error toast.
      if (isInWishlist(product.id)) {
        showSuccess('Removed from wishlist!');
      }
    } else {
      showError('Could not update wishlist. Please try again.');
    }
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
              title={!isAuthenticated ? 'Login to view your favourites' : (isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist')}
              aria-label={!isAuthenticated ? 'Login to view your favourites' : (isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist')}
              onClick={async (e) => {
                e.stopPropagation();
                e.preventDefault();
                await handleWishlistToggle(product);
              }}
            >
              <img src="/icons/heart-icon.svg" alt="Wishlist" />
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
      {/** Login prompt modal */}
      <LoginPromptModal
        open={loginPromptOpen}
        onClose={() => setLoginPromptOpen(false)}
        onGoToLogin={() => {
          setLoginPromptOpen(false);
          navigate('/auth?from=wishlist&action=favorite');
        }}
      />
    </div>
  );
};

export default ProductGrid;
