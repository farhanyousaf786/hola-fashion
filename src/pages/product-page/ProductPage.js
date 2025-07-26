import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ProductPage.css';

const ProductPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState('ivory');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  // Mock product data
  // Debug log to check if component is rendering and receiving productId
  console.log('ProductPage rendering with productId:', productId);
  
  useEffect(() => {
    // In a real app, this would be an API call to fetch product details
    const mockProduct = {
      id: productId,
      name: 'Jovani D6018 - Strapless, Sequin Prom Gown',
      brand: 'Jovani',
      sku: 'D6018',
      price: 990.00,
      images: [
        '/images/product-page-demo-img.png',
        '/images/product-page-demo-img.png',
        '/images/product-page-demo-img.png',
        '/images/product-page-demo-img.png'
      ],
      colors: ['ivory'],
      sizes: ['36', '38'],
      stock: 4,
      description: "Flourish a stunning magnificence befitting a goddess in this Sydney's Closet Bridal SC5276 creation. Fashioned with feminine lace on the bodice and long sleeves, this gown parades a deep v-neckline with a full back. Accented with a peaked empire design, the chiffon skirt gracefully floats down the aisle with its sumptuous train. Fall in love with the romance of this Sydney's Closet Bridal masterpiece. The collection of bridal outfits from Sydney's Closet is appreciated for its elegance and sophisticated charm specifically tailored to ensure perfect and comfortable fit to a real curvy body. Model is wearing the Ivory color.",
      details: {
        style: 'sydneysic_SC5276',
        fabric: 'Satin',
        details: 'Long Sleeves, Chiffon Skirt, Full Back, Zipper Closure, Sweep Train',
        length: 'Long',
        neckline: 'Low V-Neck',
        waistline: 'Empire',
        silhouette: 'A-Line'
      }
    };

    // No need for setTimeout, load data immediately
    setProduct(mockProduct);
    setLoading(false);
    
    // Debug log to confirm data is loaded
    console.log('Product data loaded:', mockProduct);
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
      alert('Please select a size');
      return;
    }
    
    console.log('Added to cart:', {
      product: product.name,
      size: selectedSize,
      color: selectedColor,
      quantity
    });
    // In a real app, this would dispatch to a cart state or API
  };

  const handleAddToWishlist = () => {
    console.log('Added to wishlist:', product.name);
    // In a real app, this would dispatch to a wishlist state or API
  };

  if (loading) {
    return <div className="loading">Loading product details...</div>;
  }

  if (!product) {
    return <div className="error">Product not found</div>;
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
              <button className="wishlist-btn" onClick={handleAddToWishlist}>
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
