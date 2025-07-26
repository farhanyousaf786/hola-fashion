import React, { useState } from 'react';
import './CustomerReviews.css';

const CustomerReviews = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const reviews = [
    {
      id: 1,
      name: 'Tanya M',
      verified: true,
      rating: 5,
      title: 'Awesome Products',
      comment: 'Very professional and user friendly at the same time. The product I order was very great.',
      avatar: '/images/demo-image.png'
    },
    {
      id: 2,
      name: 'Tanya M',
      verified: true,
      rating: 5,
      title: 'Awesome Products',
      comment: 'I love it beautiful dress, it looks the same as the picture, it looked great on me, I loved the dress, I recommend it, very good quality',
      avatar: '/images/demo-image.png'
    },
    {
      id: 3,
      name: 'Tanya M',
      verified: true,
      rating: 5,
      title: 'Awesome Products',
      comment: 'Product quality: Was well packed and exactly as described. Delivery time:Super fast shipping. Dresses arrived in perfect condition.',
      avatar: '/images/demo-image.png'
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
  };

  // Generate star rating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < rating; i++) {
      stars.push(<span key={i} className="star">★</span>);
    }
    return stars;
  };

  // For mobile view, show only the current slide
  const mobileReview = reviews[currentSlide];

  return (
    <section className="reviews-section">
      <h2 className="section-title">Real Reviews From Real Customers</h2>
      
      {/* Desktop View */}
      <div className="reviews-desktop">
        <div className="reviews-grid">
          {reviews.map((review) => (
            <div key={review.id} className="review-card">
              <div className="review-header">
                <img src={review.avatar} alt={review.name} className="reviewer-avatar" />
                <div className="reviewer-info">
                  <p className="reviewer-name">{review.name}</p>
                  <div className="rating">
                    {renderStars(review.rating)}
                  </div>
                  <p className="verified-badge">
                    <span className="verified-icon">✓</span> Verified Customer
                  </p>
                </div>
              </div>
              <h3 className="review-title">{review.title}</h3>
              <p className="review-comment">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Mobile View */}
      <div className="reviews-mobile">
        <div className="review-carousel">
          <button className="carousel-btn prev-btn" onClick={prevSlide}>
            &lt;
          </button>
          
          <div className="review-card">
            <div className="review-header">
              <img src={mobileReview.avatar} alt={mobileReview.name} className="reviewer-avatar" />
              <div className="reviewer-info">
                <p className="reviewer-name">{mobileReview.name}</p>
                <div className="rating">
                  {renderStars(mobileReview.rating)}
                </div>
                <p className="verified-badge">
                  <span className="verified-icon">✓</span> Verified Customer
                </p>
              </div>
            </div>
            <h3 className="review-title">{mobileReview.title}</h3>
            <p className="review-comment">{mobileReview.comment}</p>
          </div>
          
          <button className="carousel-btn next-btn" onClick={nextSlide}>
            &gt;
          </button>
        </div>
      </div>
      
      <div className="see-all-reviews">
        <button className="see-all-btn">SEE ALL REVIEWS</button>
      </div>
    </section>
  );
};

export default CustomerReviews;
