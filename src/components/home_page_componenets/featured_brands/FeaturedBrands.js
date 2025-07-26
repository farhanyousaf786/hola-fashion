import React from 'react';
import './FeaturedBrands.css';

const FeaturedBrands = () => {
  const brands = [
    { id: 1, name: 'JOVANI', logo: '/images/demo-image.png' },
    { id: 2, name: 'CINDERELLA DIVINE', logo: '/images/demo-image.png' },
    { id: 3, name: 'MAC DUGGAL', logo: '/images/demo-image.png' },
    { id: 4, name: 'La Femme', logo: '/images/demo-image.png' },
    { id: 5, name: 'TERANI COUTURE', logo: '/images/demo-image.png' },
    { id: 6, name: 'TARIK EDIZ', logo: '/images/demo-image.png' },
    { id: 7, name: 'SHERRI HILL', logo: '/images/demo-image.png' },
    { id: 8, name: 'GLS APPAREL USA, INC', logo: '/images/demo-image.png' },
    { id: 9, name: 'IEENA DUGGAL', logo: '/images/demo-image.png' },
    { id: 10, name: 'ALYCE PARIS', logo: '/images/demo-image.png' },
    { id: 11, name: 'MNM COUTURE', logo: '/images/demo-image.png' },
    { id: 12, name: 'MON CHERI', logo: '/images/demo-image.png' },
    { id: 13, name: 'ASHLEYlauren', logo: '/images/demo-image.png' },
    { id: 14, name: 'MAYQUEEN', logo: '/images/demo-image.png' },
    { id: 15, name: 'FAVIANA', logo: '/images/demo-image.png' }
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
