import React from 'react';
import { useNavigate } from 'react-router-dom';
import './FindYourColorPalette.css';

const FindYourColorPalette = () => {
  const navigate = useNavigate();

  const colorCategories = [
    {
      id: 1,
      name: 'White Dresses & Ball Gowns',
      color: 'white',
      image: '/images/demo-image.png'
    },
    {
      id: 2,
      name: 'Black Dresses & Ball Gowns',
      color: 'black',
      image: '/images/demo-image.png'
    },
    {
      id: 3,
      name: 'Pink Dresses & Ball Gowns',
      color: 'pink',
      image: '/images/demo-image.png'
    },
    {
      id: 4,
      name: 'Red Dresses & Ball Gowns',
      color: 'red',
      image: '/images/demo-image.png'
    },
    {
      id: 5,
      name: 'Green Dresses & Ball Gowns',
      color: 'green',
      image: '/images/demo-image.png'
    },
    {
      id: 6,
      name: 'Blue Dresses & Ball Gowns',
      color: 'blue',
      image: '/images/demo-image.png'
    },
    {
      id: 7,
      name: 'Purple Dresses & Ball Gowns',
      color: 'purple',
      image: '/images/demo-image.png'
    },
    {
      id: 8,
      name: 'Orange Dresses',
      color: 'orange',
      image: '/images/demo-image.png'
    },
    {
      id: 9,
      name: 'Gold Dresses & Ball Gowns',
      color: 'gold',
      image: '/images/demo-image.png'
    },
    {
      id: 10,
      name: 'Yellow Dresses',
      color: 'yellow',
      image: '/images/demo-image.png'
    }
  ];

  const handleColorClick = (color, colorName) => {
    // Navigate to shop page with color filter
    navigate(`/shop?color=${encodeURIComponent(color)}&colorName=${encodeURIComponent(colorName)}`);
  };

  return (
    <section className="color-palette-section">
      <h2 className="section-title">Find Your Color Palette</h2>
      <div className="color-palette-grid">
        {colorCategories.map(category => (
          <div key={category.id} className="color-item">
            <div 
              className="color-link" 
              onClick={() => handleColorClick(category.color, category.name)}
              style={{ cursor: 'pointer' }}
            >
              <div className="color-image-container">
                <img src={category.image} alt={category.name} className="color-image" />
              </div>
              <p className="color-name">{category.name}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FindYourColorPalette;
