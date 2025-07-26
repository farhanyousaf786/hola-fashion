import React from 'react';
import './MobileSortBy.css';

const MobileSortBy = ({ currentSort, onSortChange, onClose }) => {
  const sortOptions = [
    'BEST SELLING',
    'FEATURED ITEMS',
    'PRICE (LOW TO HIGH)',
    'PRICE (HIGH TO LOW)',
    'NAME (A-Z)',
    'NAME (Z-A)',
    'DATE: OLD TO NEW',
    'DATE: NEW TO OLD'
  ];

  const handleSortSelect = (option) => {
    onSortChange(option);
    onClose();
  };

  return (
    <div className="mobile-sort-overlay">
      <div className="mobile-sort-container">
        <div className="mobile-sort-header">
          <h2>SORT BY:</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        
        <div className="mobile-sort-options">
          {sortOptions.map((option, index) => (
            <div 
              key={index} 
              className={`sort-option ${currentSort === option ? 'selected' : ''}`}
              onClick={() => handleSortSelect(option)}
            >
              {option}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobileSortBy;
