import React from 'react';
import { Link } from 'react-router-dom';
import './CategoryItem.css';

const CategoryItem = ({ category }) => {
  return (
    <div className="category-item">
      <Link to={`/${category.slug}`} className="category-link">
        <div className="category-image-container">
          <img src={category.image} alt={category.name} className="category-image" />
        </div>
        <h3 className="category-name">{category.name}</h3>
      </Link>
    </div>
  );
};

export default CategoryItem;
