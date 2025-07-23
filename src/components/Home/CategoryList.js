import React from 'react';
import './CategoryList.css';
import CategoryItem from './CategoryItem';

const CategoryList = () => {
  const categories = [
    { id: 1, name: 'Prom Dresses', image: '/images/categories/prom-dresses.jpg' },
    { id: 2, name: 'Homecoming Dresses', image: '/images/categories/homecoming-dresses.jpg' },
    { id: 3, name: 'Evening Gowns', image: '/images/categories/evening-gowns.jpg' },
    { id: 4, name: 'Cocktail Dresses', image: '/images/categories/cocktail-dresses.jpg' },
    { id: 5, name: 'Formal Gowns on Sale', image: '/images/categories/formal-gowns.jpg' },
    { id: 6, name: 'Wedding Guest Dresses', image: '/images/categories/wedding-guest-dresses.jpg' },
    { id: 7, name: 'Plus Size Dresses', image: '/images/categories/plus-size-dresses.jpg' },
    { id: 8, name: 'Mother of the Bride Dresses', image: '/images/categories/mother-bride-dresses.jpg' },
    { id: 9, name: 'Bridesmaid Dresses', image: '/images/categories/bridesmaid-dresses.jpg' },
    { id: 10, name: 'Quinceanera Dresses', image: '/images/categories/quinceanera-dresses.jpg' }
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
