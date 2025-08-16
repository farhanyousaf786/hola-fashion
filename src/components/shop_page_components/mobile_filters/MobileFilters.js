import React from 'react';
import './MobileFilters.css';

const MobileFilters = ({ selectedFilters, onFilterChange, onClose, totalProducts, dynamicFilters }) => {
  // Color mapping for common colors
  const colorMap = {
    'red': '#FF0000',
    'blue': '#0000FF',
    'green': '#008000',
    'black': '#000000',
    'white': '#FFFFFF',
    'pink': '#FFC0CB',
    'purple': '#800080',
    'yellow': '#FFFF00',
    'orange': '#FFA500',
    'brown': '#A52A2A',
    'gray': '#808080',
    'grey': '#808080',
    'navy': '#000080',
    'beige': '#F5F5DC',
    'gold': '#FFD700',
    'silver': '#C0C0C0',
    'burgundy': '#800020'
  };

  // Only use sizes that are actually available in Firebase products
  const sizeFilters = dynamicFilters.sizes.map(size => ({
    id: size.toLowerCase(),
    label: size.toUpperCase()
  }));

  const colorFilters = dynamicFilters.colors.map(color => ({
    id: color.toLowerCase(),
    label: color,
    color: colorMap[color.toLowerCase()] || '#CCCCCC'
  }));

  const brandFilters = dynamicFilters.brands.map(brand => ({
    id: brand.toLowerCase().replace(/\s+/g, '-'),
    label: brand.toUpperCase()
  }));

  const priceFilters = dynamicFilters.priceRanges;

  const handleFilterClick = (filterType, value) => {
    const isChecked = !selectedFilters[filterType].includes(value);
    onFilterChange(filterType, value, isChecked);
  };

  const isFilterSelected = (filterType, value) => {
    return selectedFilters[filterType].includes(value);
  };

  const totalSelectedFilters = Object.values(selectedFilters).flat().length;

  return (
    <div className="mobile-filters-overlay">
      <div className="mobile-filters-container">
        <div className="mobile-filters-header">
          <h2>Filter</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>

        <div className="mobile-filters-content">
          {sizeFilters.length > 0 && (
            <div className="filter-section">
              <div className="filter-header">
                <h3>SIZE</h3>
                <span className="dropdown-arrow">▼</span>
              </div>
              <div className="filter-options size-options">
                {sizeFilters.map(filter => (
                  <div 
                    className={`size-box ${isFilterSelected('size', filter.id) ? 'selected' : ''}`}
                    key={filter.id}
                    onClick={() => handleFilterClick('size', filter.id)}
                  >
                    {filter.label}
                  </div>
                ))}
              </div>
            </div>
          )}

          {colorFilters.length > 0 && (
            <div className="filter-section">
              <div className="filter-header">
                <h3>COLOR</h3>
                <span className="dropdown-arrow">▼</span>
              </div>
              <div className="filter-options color-options">
                {colorFilters.map(filter => (
                  <div className="color-filter" key={filter.id}>
                    <div 
                      className={`color-box ${isFilterSelected('color', filter.id) ? 'selected' : ''}`}
                      style={{ backgroundColor: filter.color }}
                      onClick={() => handleFilterClick('color', filter.id)}
                    ></div>
                    <span className="color-label">{filter.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}



          {priceFilters.length > 0 && (
            <div className="filter-section">
              <div className="filter-header">
                <h3>PRICE</h3>
                <span className="dropdown-arrow">▼</span>
              </div>
              <div className="filter-options">
                {priceFilters.map(filter => (
                  <div className="filter-option" key={filter.id}>
                    <label className="checkbox-container">
                      <input 
                        type="checkbox" 
                        checked={isFilterSelected('priceRange', filter.id)}
                        onChange={() => handleFilterClick('priceRange', filter.id)} 
                      />
                      <span className="checkmark"></span>
                      {filter.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mobile-filters-footer">
          <button className="clear-all-button" disabled={totalSelectedFilters === 0}>
            CLEAR ALL
          </button>
          <button className="show-results-button" onClick={onClose}>
            SHOW RESULTS ({totalProducts})
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileFilters;
