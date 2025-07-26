import React from 'react';
import './FeaturedIn.css';

const FeaturedIn = () => {
  const features = [
    { id: 1, name: 'Newsweek', logo: '/images/demo-image.png' },
    { id: 2, name: 'JOVANI', logo: '/images/demo-image.png' },
    { id: 3, name: 'MAC DUGGAL', logo: '/images/demo-image.png' },
    { id: 4, name: 'SHERRI HILL', logo: '/images/demo-image.png' },
    { id: 5, name: 'BRIDES', logo: '/images/demo-image.png' },
    { id: 6, name: 'seventeen', logo: '/images/demo-image.png' },
    { id: 7, name: 'POPSUGAR', logo: '/images/demo-image.png' },
    { id: 8, name: 'FASHIONISERS', logo: '/images/demo-image.png' },
    { id: 9, name: 'teen VOGUE', logo: '/images/demo-image.png' },
    { id: 10, name: 'the knot', logo: '/images/demo-image.png' }
  ];

  return (
    <section className="featured-in-section">
      <h2 className="section-title">FEATURED IN...</h2>
      <div className="features-grid">
        {features.map(feature => (
          <div key={feature.id} className="feature-card">
            <div className="feature-logo-container">
              <div className="feature-name">{feature.name}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="shop-latest">
        <h3 className="shop-latest-title">SHOP THE LATEST DRESSES AT HOLA FASHION!</h3>
        <p className="shop-latest-text">
          Couture Candy presents you with a curated collection of high-end fashion pieces by famous designers to ignite your fashionista. Our range includes everything from prom dresses to mother of the bride dresses, homecoming, and bridesmaid dresses.
        </p>
      </div>
    </section>
  );
};

export default FeaturedIn;
