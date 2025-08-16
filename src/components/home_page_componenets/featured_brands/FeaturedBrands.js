import React from 'react';
import './FeaturedBrands.css';

const FeaturedBrands = () => {
  const brands = [
    { id: 1, name: 'RALLINA', logo: '/images/demo-image.png' }
  ];

  return (
    <section className="featured-brands-section">
      <h2 className="section-title">OUR FEATURED BRANDS</h2>
      <div className="brands-grid">
        {brands.map(brand => (
          <div key={brand.id} className="brand-card">
            <a href={`/brands/${brand.name.toLowerCase().replace(/\s+/g, '-')}`} className="brand-link">
              <div className="brand-logo-container">
                <div className="brand-name">{brand.name}</div>
              </div>
            </a>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedBrands;
