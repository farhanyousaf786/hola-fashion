import React from 'react';
import './CategoryList.css';
import CategoryItem from '../category_items/CategoryItem';
import { HEADER_CATEGORIES } from '../../../models/ItemModel';

const CategoryList = () => {
  // Dynamic categories based on Firebase header categories with random images
  const categories = [
    { id: 1, name: 'Prom Dresses', slug: 'prom', image: 'https://images.pexels.com/photos/1721558/pexels-photo-1721558.jpeg' },
    { id: 2, name: 'Homecoming Dresses', slug: 'hoco', image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg' },
    { id: 3, name: 'Wedding Dresses', slug: 'wedding', image: 'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg' },
    { id: 4, name: 'Wedding Guest Dresses', slug: 'wedding-guest', image: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg' },
    { id: 5, name: 'Bridesmaid Dresses', slug: 'bridesmaid', image: 'https://images.pexels.com/photos/1702736/pexels-photo-1702736.jpeg' },
    { id: 6, name: 'Mother of the Bride Dresses', slug: 'mother-of-bride', image: 'https://images.pexels.com/photos/1755385/pexels-photo-1755385.jpeg' },
    { id: 7, name: 'Quinceanera Dresses', slug: 'quince', image: 'https://images.pexels.com/photos/1721558/pexels-photo-1721558.jpeg' },
    { id: 8, name: 'Formal Dresses', slug: 'formal', image: 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg' },
    { id: 9, name: 'Other Dresses', slug: 'others', image: 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg' }
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
