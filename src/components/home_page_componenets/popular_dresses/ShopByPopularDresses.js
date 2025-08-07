import React from 'react';
import { Link } from 'react-router-dom';
import './ShopByPopularDresses.css';

const ShopByPopularDresses = () => {
  const popularDresses = [
    {
      id: 1,
      name: 'Ladivine CC0688 - Strapless Beaded Long Gown',
      price: '$435.00 USD',
      image: '/images/demo-image.png',
      colors: ['pink', 'black', 'gold'],
      plusSizes: 2
    },
    {
      id: 2,
      name: 'Ladivine CD785 - Bejeweled Sweetheart Long Gown',
      price: '$450.00 USD',
      image: '/images/demo-image.png',
      colors: ['pink', 'gold', 'olive'],
      plusSizes: 2
    },
    {
      id: 3,
      name: 'Ladivine CD0216 - Bead Embellished Sheath Gown',
      price: '$320.00 USD',
      image: '/images/demo-image.png',
      colors: ['pink', 'gold', 'olive'],
      plusSizes: 2
    },
    {
      id: 4,
      name: 'Ladivine CM371 - Rhinestone-Embellished Scoop Neck Prom Gown',
      price: '$289.00 USD',
      image: '/images/demo-image.png',
      colors: ['pink', 'black', 'gold'],
      plusSizes: 2
    }
  ];

  return (
    <section className="popular-dresses-section">
      <h2 className="section-title">Shop By Popular Dresses</h2>
      <div className="popular-dresses-grid">
        {popularDresses.map(dress => (
          <Link key={dress.id} to={`/product/${dress.id}`} className="dress-card-link">
            <div className="dress-card">
              <div className="dress-image-container">
                <img src={dress.image} alt={dress.name} className="dress-image" />
              </div>
              <div className="color-swatches-container">
                <div className="color-swatches">
                  {dress.colors.map((color, index) => (
                    <div key={index} className={`color-swatch ${color}`}></div>
                  ))}
                </div>
                <div className="plus-size">
                  +{dress.plusSizes}
                </div>
              </div>
              <div className="dress-info">
                <h3 className="dress-name">{dress.name}</h3>
                <p className="dress-price">{dress.price}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div className="view-more-container">
        <button className="view-more-btn">VIEW MORE</button>
      </div>
    </section>
  );
};

export default ShopByPopularDresses;
