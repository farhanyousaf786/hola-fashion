import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './FeaturedBrands.css';

const FeaturedBrands = () => {
  const brands = [
    { id: 1, name: 'RALLINA', logo: '/images/demo-image.png' }
  ];

  const navigate = useNavigate();
  const location = useLocation();

  const handleRallinaClick = (e) => {
    e.preventDefault();
    // Always scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Navigate to home if not already there
    if (location.pathname !== '/') {
      navigate('/');
    }
  };

  return (
    <section className="featured-brands-section">
      <h2 className="section-title">OUR FEATURED BRANDS</h2>
      <div className="brands-grid">
        {brands.map(brand => (
          <div key={brand.id} className="brand-card">
            <Link to="/" className="brand-link" onClick={handleRallinaClick}>
              <div className="brand-logo-container">
                <div className="brand-name">{brand.name}</div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedBrands;
