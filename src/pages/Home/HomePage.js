import React from 'react';
import './HomePage.css';
import HeroBanner from '../../components/Home/HeroBanner';
import CategoryList from '../../components/Home/CategoryList';

const HomePage = () => {
  return (
    <div className="home-page">
      <HeroBanner />
      <CategoryList />
    </div>
  );
};

export default HomePage;
