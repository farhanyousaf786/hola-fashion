import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ProductPage.css';
import { getItemById } from '../../firebase/services/itemService';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const ProductPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart, isInCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [productId]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching product with ID:', productId);
        
        // Fetch product from Firebase
        const item = await getItemById(productId);
        
        if (!item) {
          setError('Product not found');
          return;
        }
        
        // Convert ItemModel to product format expected by ProductPage
        const productData = {
          id: item.id,
          name: item.name,
          brand: item.brand || 'Rallina',
          sku: item.id,
          price: item.price,
          originalPrice: item.originalPrice,
          images: item.images && item.images.length > 0 ? item.images : [
            'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg'
          ],
          colors: item.colors || ['ivory'],
          sizes: item.sizes || ['S', 'M', 'L'],
          stock: item.stock || 0,
          description: item.description || 'Beautiful dress perfect for your special occasion.',
          category: item.category,
          headerCategory: item.headerCategory,
          subHeaderCategory: item.subHeaderCategory,
          details: {
            style: item.id,
            fabric: item.fabric || 'Premium Fabric',
            details: item.details || 'Elegant design with premium craftsmanship',
            length: item.length || 'Long',
            neckline: item.neckline || 'Classic',
            waistline: item.waistline || 'Natural',
            silhouette: item.silhouette || 'A-Line'
          }
        };
        
        setProduct(productData);
        
        // Set default color if available
        if (productData.colors && productData.colors.length > 0) {
          setSelectedColor(productData.colors[0]);
        }
        
        console.log('Product data loaded:', productData);
        
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color);
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity > 0 && newQuantity <= (product?.stock || 1)) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      showError('Please select a size');
      return;
    }
    
    try {
      addToCart(product, selectedSize, selectedColor, quantity);
      showSuccess(`Added ${quantity} item${quantity > 1 ? 's' : ''} to cart!`);
      
      console.log('Added to cart:', {
        product: product.name,
        size: selectedSize,
        color: selectedColor,
        quantity
      });
    } catch (error) {
      showError('Error adding to cart. Please try again.');
      console.error('Error adding to cart:', error);
    }
  };

  const handleAddToWishlist = () => {
    if (!isAuthenticated) {
      navigate('/auth?from=wishlist&action=favorite');
      return;
    }
    
    const wasAdded = toggleWishlist(product);
    const message = wasAdded ? 'Added to wishlist!' : 'Removed from wishlist!';
    showSuccess(message);
  };

  if (loading) {
    return (
      <div className="product-page">
        <div className="loading-container" style={{ textAlign: 'center', padding: '4rem 0' }}>
          <div className="loading-spinner" style={{ 
            width: '50px', 
            height: '50px', 
            border: '4px solid #f3f3f3', 
            borderTop: '4px solid #007bff', 
            borderRadius: '50%', 
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p>Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-page">
        <div className="error-container" style={{ textAlign: 'center', padding: '4rem 0' }}>
          <p style={{ color: '#dc3545', fontSize: '1.1rem', marginBottom: '1rem' }}>
            {error || 'Product not found'}
          </p>
          <button 
            onClick={() => window.history.back()} 
            style={{ 
              padding: '0.75rem 2rem', 
              background: '#007bff', 
              color: 'white', 
              border: 'none', 
              borderRadius: '6px', 
              cursor: 'pointer',
              marginRight: '1rem'
            }}
          >
            Go Back
          </button>
          <button 
            onClick={() => window.location.reload()} 
            style={{ 
              padding: '0.75rem 2rem', 
              background: '#6c757d', 
              color: 'white', 
              border: 'none', 
              borderRadius: '6px', 
              cursor: 'pointer' 
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="product-page">
      <div className="breadcrumb">
        <a href="/">Home</a> &gt; <a href="/dresses">Dresses</a> &gt; <a href="/wedding">Wedding</a> &gt; <span>{product.name}</span>
      </div>
      
      <div className="product-content">
        <div className="product-gallery">
          <div className="thumbnail-column">
            {product.images.map((image, index) => (
              <div 
                key={index} 
                className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                onClick={() => setSelectedImage(index)}
              >
                <img src={image} alt={`${product.name} thumbnail ${index + 1}`} />
              </div>
            ))}
          </div>
          
          <div className="main-image">
            <img src={product.images[selectedImage]} alt={product.name} />
          </div>
        </div>
        
        <div className="product-details">
          <h1 className="product-title">{product.name}</h1>
          <div className="product-brand">{product.brand} {product.sku}</div>
          <div className="product-price">${product.price.toFixed(2)} USD</div>
          
          <div className="size-guide">
            <img src="/icons/ruler-icon.svg" alt="Size Guide" className="size-guide-icon" />
            <span>Size Guide</span>
          </div>
          
          <div className="product-options">
            <div className="option-section">
              <div className="option-label">Size:</div>
              <div className="size-options">
                {product.sizes.map(size => (
                  <div 
                    key={size} 
                    className={`size-box ${selectedSize === size ? 'selected' : ''}`}
                    onClick={() => handleSizeSelect(size)}
                  >
                    {size}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="option-section">
              <div className="option-label">Color:</div>
              <div className="color-options">
                {product.colors.map(color => (
                  <div 
                    key={color} 
                    className={`color-option ${selectedColor === color ? 'selected' : ''}`}
                    onClick={() => handleColorSelect(color)}
                  >
                    <div className="color-box" style={{ backgroundColor: color === 'ivory' ? '#FFFFF0' : color }}></div>
                    <div className="color-name">{color}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="stock-info">
            We currently have <strong>{product.stock}</strong> in stock.
          </div>
          
          <div className="add-to-cart-section">
            <div className="quantity-selector">
              <button 
                className="quantity-btn" 
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="quantity">{quantity}</span>
              <button 
                className="quantity-btn" 
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= product.stock}
              >
                +
              </button>
            </div>
            
            <div className="action-buttons">
              <button className="add-to-cart-btn" onClick={handleAddToCart}>
                ADD TO CART
              </button>
              <button 
                className={`wishlist-btn ${product && isInWishlist(product.id) ? 'active' : ''}`} 
                onClick={handleAddToWishlist}
              >
                <img src="/icons/heart-icon.svg" alt="Add to Wishlist" />
              </button>
            </div>
          </div>
          
          <div className="shipping-info">
            <div className="info-box">
              <div className="info-icon">
                <img src="/icons/shipping-icon.svg" alt="Free Shipping" />
              </div>
              <div className="info-content">
                <div className="info-title">Free Shipping</div>
                <div className="info-text">Free shipping for orders over $299</div>
                <a href="#" className="info-link">See Details &gt;</a>
              </div>
            </div>
            
            <div className="info-box">
              <div className="info-icon">
                <img src="/icons/returns-icon.svg" alt="Exchanges & Returns" />
              </div>
              <div className="info-content">
                <div className="info-title">Exchanges & Returns</div>
                <div className="info-text">Easy returns & exchanges within 5 days on eligible items</div>
                <a href="#" className="info-link">See Details &gt;</a>
              </div>
            </div>
            
            <div className="info-box">
              <div className="info-icon">
                <img src="/icons/price-match-icon.svg" alt="Price Match" />
              </div>
              <div className="info-content">
                <div className="info-title">Price Match</div>
                <div className="info-text">Find a lower price? We'll match it. Exclusions may apply.</div>
                <a href="#" className="info-link">See Details &gt;</a>
              </div>
            </div>
            
            <div className="info-box">
              <div className="info-icon">
                <img src="/icons/tax-icon.svg" alt="No Tax" />
              </div>
              <div className="info-content">
                <div className="info-title">No Tax</div>
                <div className="info-text">No Sales Tax if shipped outside NY, CA, FL, GA, IL, MI or PA. Save 10%.</div>
                <a href="#" className="info-link">See Details &gt;</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="product-description">
        <div className="description-header">
          <img src="/icons/description-icon.svg" alt="Description" />
          <h2>DESCRIPTION</h2>
        </div>
        
        <div className="description-content">
          <p>{product.description}</p>
          
          <div className="product-specs">
            <div className="spec-row">
              <div className="spec-label">Style:</div>
              <div className="spec-value">{product.details.style}</div>
            </div>
            <div className="spec-row">
              <div className="spec-label">Fabric:</div>
              <div className="spec-value">{product.details.fabric}</div>
            </div>
            <div className="spec-row">
              <div className="spec-label">Details:</div>
              <div className="spec-value">{product.details.details}</div>
            </div>
            <div className="spec-row">
              <div className="spec-label">Length:</div>
              <div className="spec-value">{product.details.length}</div>
            </div>
            <div className="spec-row">
              <div className="spec-label">Neckline:</div>
              <div className="spec-value">{product.details.neckline}</div>
            </div>
            <div className="spec-row">
              <div className="spec-label">Waistline:</div>
              <div className="spec-value">{product.details.waistline}</div>
            </div>
            <div className="spec-row">
              <div className="spec-label">Silhouette:</div>
              <div className="spec-value">{product.details.silhouette}</div>
            </div>
          </div>
          
          <div className="returns-policy">
            <p>Please refer to our returns and exchanges policy page (<a href="#">click here</a>) for more details.</p>
            <p>SKU: {product.details.style}-{selectedColor}-{selectedSize || product.sizes[0]}</p>
          </div>
          
          <div className="trust-badges">
            <img src="/icons/trust-badge-1.svg" alt="Trust Badge" />
            <img src="/icons/trust-badge-2.svg" alt="BBB Accredited Business" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
