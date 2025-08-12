import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import './WishlistPage.css';

const WishlistPage = () => {
  const { wishlistItems, removeFromWishlist, getWishlistCount } = useWishlist();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth?from=wishlist&action=favorite');
    }
  }, [isAuthenticated, navigate]);

  const handleRemoveFromWishlist = (productId) => {
    removeFromWishlist(productId);
    showSuccess('Removed from wishlist!');
  };

  const handleAddToCart = (product) => {
    // Add to cart with default size and color
    const defaultSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'M';
    const defaultColor = product.colors && product.colors.length > 0 ? product.colors[0] : 'default';
    
    try {
      addToCart(product, defaultSize, defaultColor, 1);
      showSuccess('Added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      showError('Error adding to cart. Please try again.');
    }
  };

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="wishlist-page">
      <div className="wishlist-container">
        <div className="wishlist-header">
          <h1>My Wishlist</h1>
          <p className="wishlist-count">
            {getWishlistCount()} {getWishlistCount() === 1 ? 'item' : 'items'}
          </p>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="empty-wishlist">
            <div className="empty-wishlist-icon">
              <img src="/icons/heart-icon.svg" alt="Empty Wishlist" />
            </div>
            <h2>Your wishlist is empty</h2>
            <p>Save your favorite items to your wishlist and shop them later!</p>
            <Link to="/shop" className="continue-shopping-btn">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="wishlist-grid">
            {wishlistItems.map((product) => (
              <div key={product.id} className="wishlist-item">
                <div className="wishlist-item-image">
                  <Link to={`/product/${product.id}`}>
                    <img 
                      src={product.images && product.images.length > 0 ? product.images[0] : product.image} 
                      alt={product.name} 
                    />
                  </Link>
                  <button 
                    className="remove-btn"
                    onClick={() => handleRemoveFromWishlist(product.id)}
                    title="Remove from wishlist"
                  >
                    ×
                  </button>
                </div>
                
                <div className="wishlist-item-info">
                  <Link to={`/product/${product.id}`} className="product-link">
                    <h3 className="product-name">{product.name}</h3>
                  </Link>
                  
                  <div className="product-price">
                    ${product.price ? product.price.toFixed(2) : '0.00'} USD
                  </div>
                  
                  {product.colors && product.colors.length > 0 && (
                    <div className="product-colors">
                      {product.colors.slice(0, 3).map((color, index) => (
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
                      {product.colors.length > 3 && (
                        <span className="more-colors">+{product.colors.length - 3}</span>
                      )}
                    </div>
                  )}
                  
                  <div className="wishlist-item-actions">
                    <button 
                      className="add-to-cart-btn"
                      onClick={() => handleAddToCart(product)}
                    >
                      Add to Cart
                    </button>
                    <Link to={`/product/${product.id}`} className="view-details-btn">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
