import React from 'react';
import './FindYourColorPalette.css';

const FindYourColorPalette = () => {
  const colorCategories = [
    {
      id: 1,
      name: 'White Dresses & Ball Gowns',
      image: '/images/demo-image.png'
    },
    {
      id: 2,
      name: 'Black Dresses & Ball Gowns',
      image: '/images/demo-image.png'
    },
    {
      id: 3,
      name: 'Pink Dresses & Ball Gowns',
      image: '/images/demo-image.png'
    },
    {
      id: 4,
      name: 'Red Dresses & Ball Gowns',
      image: '/images/demo-image.png'
    },
    {
      id: 5,
      name: 'Green Dresses & Ball Gowns',
      image: '/images/demo-image.png'
    },
    {
      id: 6,
      name: 'Blue Dresses & Ball Gowns',
      image: '/images/demo-image.png'
    },
    {
      id: 7,
      name: 'Purple Dresses & Ball Gowns',
      image: '/images/demo-image.png'
    },
    {
      id: 8,
      name: 'Orange Dresses',
      image: '/images/demo-image.png'
    },
    {
      id: 9,
      name: 'Gold Dresses & Ball Gowns',
      image: '/images/demo-image.png'
    },
    {
      id: 10,
      name: 'Yellow Dresses',
      image: '/images/demo-image.png'
    }
  ];

  return (
    <section className="color-palette-section">
      <h2 className="section-title">Find Your Color Palette</h2>
      <div className="color-palette-grid">
        {colorCategories.map(category => (
          <div key={category.id} className="color-item">
            <a href={`/color/${category.name.toLowerCase().replace(/\s+/g, '-')}`} className="color-link">
              <div className="color-image-container">
                <img src={category.image} alt={category.name} className="color-image" />
              </div>
              <p className="color-name">{category.name}</p>
            </a>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FindYourColorPalette;
