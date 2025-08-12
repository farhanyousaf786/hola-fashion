import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFeaturedItems } from '../../../firebase/services/itemService';
import './ShopByPopularDresses.css';

const ShopByPopularDresses = () => {
  const [popularDresses, setPopularDresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);
  
  // Show only 4 items initially (one row), then all items when expanded
  const itemsToShow = showAll ? popularDresses : popularDresses.slice(0, 4);

  useEffect(() => {
    const fetchFeaturedItems = async () => {
      try {
        setLoading(true);
        console.log('Fetching featured items from Firebase...');
        const featuredItems = await getFeaturedItems(8); // Get 8 featured items
        console.log('Featured items fetched:', featuredItems);
        console.log('Number of featured items:', featuredItems.length);
        setPopularDresses(featuredItems);
      } catch (err) {
        console.error('Detailed error fetching featured items:', err);
        console.error('Error message:', err.message);
        console.error('Error code:', err.code);
        setError(`Failed to load featured items: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedItems();
  }, []);

  if (loading) {
    return (
      <section className="popular-dresses-section">
        <h2 className="section-title">Shop By Popular Dresses</h2>
        <div className="loading-message">Loading featured items...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="popular-dresses-section">
        <h2 className="section-title">Shop By Popular Dresses</h2>
        <div className="error-message">{error}</div>
      </section>
    );
  }

  return (
    <section className="popular-dresses-section">
      <h2 className="section-title">Shop By Popular Dresses</h2>
      <div className="popular-dresses-grid">
        {itemsToShow.map(dress => (
          <Link key={dress.id} to={`/product/${dress.id}`} className="dress-card-link">
            <div className="dress-card">
              <div className="dress-image-container">
                <img 
                  src={dress.mainImage || dress.images[0] || '/images/demo-image.png'} 
                  alt={dress.name} 
                  className="dress-image" 
                />
              </div>
              <div className="color-swatches-container">
                <div className="color-swatches">
                  {dress.colors && dress.colors.map((color, index) => (
                    <div key={index} className={`color-swatch ${color}`}></div>
                  ))}
                </div>
                <div className="plus-size">
                  +{dress.sizes ? dress.sizes.length : 0}
                </div>
              </div>
              <div className="dress-info">
                <h3 className="dress-name">{dress.name}</h3>
                <p className="dress-price">
                  {dress.discountPrice > 0 ? `$${dress.discountPrice}` : `$${dress.price}`}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
      {popularDresses.length === 0 && (
        <div className="no-items-message">No featured items available at the moment.</div>
      )}
      {popularDresses.length > 4 && (
        <div className="view-more-container">
          <button 
            className="view-more-btn" 
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? 'SHOW LESS' : 'VIEW MORE'}
          </button>
        </div>
      )}
    </section>
  );
};

export default ShopByPopularDresses;
