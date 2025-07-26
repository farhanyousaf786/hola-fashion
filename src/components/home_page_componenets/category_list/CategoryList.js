import React from 'react';
import './CategoryList.css';
import CategoryItem from '../category_items/CategoryItem';

const CategoryList = () => {
  const categories = [
    { id: 1, name: 'Prom Dresses', image: '/images/demo-image.png' },
    { id: 2, name: 'Homecoming Dresses', image: '/images/demo-image.png' },
    { id: 3, name: 'Evening Gowns', image: '/images/demo-image.png' },
    { id: 4, name: 'Cocktail Dresses', image: '/images/demo-image.png' },
    { id: 5, name: 'Formal Gowns on Sale', image: '/images/demo-image.png' },
    { id: 6, name: 'Wedding Guest Dresses', image: '/images/demo-image.png' },
    { id: 7, name: 'Plus Size Dresses', image: '/images/demo-image.png' },
    { id: 8, name: 'Mother of the Bride Dresses', image: '/images/demo-image.png' },
    { id: 9, name: 'Bridesmaid Dresses', image: '/images/demo-image.png' },
    { id: 10, name: 'Quinceanera Dresses', image: '/images/demo-image.png' }
  ];

  return (
    <section className="category-section">
      <h2 className="section-title">Shop By Category</h2>
      <div className="category-grid">
        {categories.map(category => (
          <CategoryItem key={category.id} category={category} />
        ))}
      </div>
    </section>
  );
};

export default CategoryList;
