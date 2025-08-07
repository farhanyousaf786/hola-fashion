import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getItemsByHeaderCategory, getItemsBySubHeaderCategory } from '../../firebase/services/itemService';
import { HEADER_CATEGORIES, SUB_HEADER_CATEGORIES } from '../../models/ItemModel';
import './CategoryPage.css';

const CategoryPage = () => {
  const { category, subCategory } = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(subCategory || 'all');

  // Get category info
  const categoryInfo = HEADER_CATEGORIES.find(cat => cat.value === category);
  const subCategories = SUB_HEADER_CATEGORIES[category] || [];

  useEffect(() => {
    fetchItems();
  }, [category, selectedSubCategory]);

  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let fetchedItems = [];
      
      if (selectedSubCategory === 'all') {
        // Fetch all items for the header category
        fetchedItems = await getItemsByHeaderCategory(category);
      } else {
        // Fetch items for specific sub-category
        fetchedItems = await getItemsBySubHeaderCategory(category, selectedSubCategory);
      }
      
      setItems(fetchedItems);
    } catch (err) {
      console.error('Error fetching items:', err);
      setError('Failed to load items. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubCategoryChange = (subCat) => {
    setSelectedSubCategory(subCat);
  };

  if (!categoryInfo) {
    return (
      <div className="category-page">
        <div className="container">
          <div className="error-message">
            <h2>Category Not Found</h2>
            <p>The category "{category}" does not exist.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="category-page">
      <div className="container">
        {/* Category Header */}
        <div className="category-header">
          <h1 className="category-title">{categoryInfo.label}</h1>
          <p className="category-subtitle">
            Discover our beautiful collection of {categoryInfo.label.toLowerCase()} dresses and accessories
          </p>
        </div>

        {/* Sub-category Filter */}
        {subCategories.length > 0 && (
          <div className="subcategory-filter">
            <button
              className={`filter-btn ${selectedSubCategory === 'all' ? 'active' : ''}`}
              onClick={() => handleSubCategoryChange('all')}
            >
              All {categoryInfo.label}
            </button>
            {subCategories.map((subCat) => (
              <button
                key={subCat.value}
                className={`filter-btn ${selectedSubCategory === subCat.value ? 'active' : ''}`}
                onClick={() => handleSubCategoryChange(subCat.value)}
              >
                {subCat.label}
              </button>
            ))}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading {categoryInfo.label.toLowerCase()} items...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="error-container">
            <p className="error-message">{error}</p>
            <button onClick={fetchItems} className="retry-btn">Try Again</button>
          </div>
        )}

        {/* Items Grid */}
        {!loading && !error && (
          <div className="items-section">
            <div className="items-header">
              <h2>
                {selectedSubCategory === 'all' 
                  ? `All ${categoryInfo.label} Items` 
                  : subCategories.find(sub => sub.value === selectedSubCategory)?.label || 'Items'
                }
              </h2>
              <span className="items-count">({items.length} items)</span>
            </div>

            {items.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">👗</div>
                <h3>No Items Found</h3>
                <p>
                  We don't have any {categoryInfo.label.toLowerCase()} items available right now.
                  <br />
                  Please check back later or explore other categories.
                </p>
              </div>
            ) : (
              <div className="items-grid">
                {items.map((item) => (
                  <div key={item.id} className="item-card">
                    <div className="item-image">
                      <img 
                        src={item.getMainImage()} 
                        alt={item.name}
                        onError={(e) => {
                          e.target.src = 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg';
                        }}
                      />
                      {item.featured && <span className="featured-badge">Featured</span>}
                      {item.isOnSale() && (
                        <span className="sale-badge">-{item.getDiscountPercentage()}%</span>
                      )}
                    </div>
                    <div className="item-info">
                      <h3 className="item-name">{item.name}</h3>
                      <p className="item-description">{item.description}</p>
                      <div className="item-price">
                        {item.isOnSale() ? (
                          <>
                            <span className="original-price">{item.getFormattedPrice()}</span>
                            <span className="sale-price">{item.getFormattedDiscountPrice()}</span>
                          </>
                        ) : (
                          <span className="price">{item.getFormattedPrice()}</span>
                        )}
                      </div>
                      <div className="item-meta">
                        <span className="brand">{item.brand}</span>
                        <span className="availability">{item.getAvailabilityStatus()}</span>
                      </div>
                      <div className="item-actions">
                        <button className="btn-primary">View Details</button>
                        <button className="btn-secondary">Add to Wishlist</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
