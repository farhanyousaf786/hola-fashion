import React from 'react';
import { Link } from 'react-router-dom';
import './ProductGrid.css';

const ProductGrid = ({ products }) => {
  const toggleWishlist = (productId) => {
    // This would typically update state or call an API
    console.log(`Toggle wishlist for product ${productId}`);
  };

  return (
    <div className="product-grid">
      {products.map(product => (
        <div className="product-card" key={product.id}>
          <Link to={`/product/${product.id}`} className="product-link">
          <div className="product-image-container">
            <img src={product.image} alt={product.name} className="product-image" />
            <button 
              className={`wishlist-button ${product.isWishlist ? 'active' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                toggleWishlist(product.id);
              }}
            >
              {product.isWishlist ? '❤️' : '♡'}
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
