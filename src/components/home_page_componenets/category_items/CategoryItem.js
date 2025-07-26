import React from 'react';
import './CategoryItem.css';

const CategoryItem = ({ category }) => {
  return (
    <div className="category-item">
      <a href={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`} className="category-link">
        <div className="category-image-container">
          <img src={category.image} alt={category.name} className="category-image" />
        </div>
        <h3 className="category-name">{category.name}</h3>
      </a>
    </div>
  );
};

export default CategoryItem;
