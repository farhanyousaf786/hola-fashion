import React from 'react';
import './MobileFilters.css';

const MobileFilters = ({ selectedFilters, onFilterChange, onClose, totalProducts }) => {
  // Mock data for filters
  const saleFilters = [
    { id: 'under-31', label: 'UNDER 31%' },
    { id: '31-51', label: '31% - 51%' },
    { id: '51-71', label: '51% - 71%' },
    { id: 'above-71', label: 'ABOVE 71%' }
  ];

  const sizeFilters = [
    { id: '00', label: '00' },
    { id: '0', label: '0' },
    { id: '2', label: '2' },
    { id: '4', label: '4' },
    { id: '6', label: '6' },
    { id: '8', label: '8' },
    { id: '10', label: '10' },
    { id: '12', label: '12' },
    { id: '14', label: '14' },
    { id: '16', label: '16' },
    { id: '18', label: '18' },
    { id: '20', label: '20' },
    { id: '22', label: '22' }
  ];

  const colorFilters = [
    { id: 'beige', label: 'Beige', color: '#F5E1C9' },
    { id: 'black', label: 'Black', color: '#000000' },
    { id: 'blue', label: 'Blue', color: '#A7C5EB' },
    { id: 'floral', label: 'Floral', color: '#B5A642' }
  ];

  const designerFilters = [
    { id: 'adrianna-papell', label: 'ADRIANNA PAPELL' },
    { id: 'adrianna-papell-2', label: 'ADRIANNA PAPELL' },
    { id: 'adrianna-papell-3', label: 'ADRIANNA PAPELL' },
    { id: 'adrianna-papell-4', label: 'ADRIANNA PAPELL' }
  ];

  const priceFilters = [
    { id: 'under-100', label: 'UNDER $100' },
    { id: '100-200', label: '$100 - $200' },
    { id: '200-300', label: '$200 - $300' },
    { id: '300-400', label: '$300 - $400' },
    { id: '400-500', label: '$400 - $500' },
    { id: 'above-500', label: 'ABOVE $500' }
  ];

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
          <div className="filter-section">
            <div className="filter-header">
              <h3>SALE</h3>
              <span className="dropdown-arrow">▼</span>
            </div>
            <div className="filter-options">
              {saleFilters.map(filter => (
                <div className="filter-option" key={filter.id}>
                  <label className="checkbox-container">
                    <input 
                      type="checkbox" 
                      checked={isFilterSelected('sale', filter.id)}
                      onChange={() => handleFilterClick('sale', filter.id)} 
                    />
                    <span className="checkmark"></span>
                    {filter.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

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
              <div className="show-more">+ Show more</div>
            </div>
          </div>

          <div className="filter-section">
            <div className="filter-header">
              <h3>DESIGNER</h3>
              <span className="dropdown-arrow">▼</span>
            </div>
            <div className="filter-options">
              {designerFilters.map(filter => (
                <div className="designer-option" key={filter.id}>
                  <div 
                    className={`designer-box ${isFilterSelected('designer', filter.id) ? 'selected' : ''}`}
                    onClick={() => handleFilterClick('designer', filter.id)}
                  >
                    {filter.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

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
