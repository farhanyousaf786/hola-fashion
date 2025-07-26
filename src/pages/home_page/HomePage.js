import React from 'react';
import './HomePage.css';
import HeroBanner from '../../components/home_page_componenets/hero_banner/HeroBanner';
import CategoryList from '../../components/home_page_componenets/category_list/CategoryList';
import ShopByPopularDresses from '../../components/home_page_componenets/popular_dresses/ShopByPopularDresses';
import FindYourColorPalette from '../../components/home_page_componenets/color_palette/FindYourColorPalette';
import CustomerReviews from '../../components/home_page_componenets/customer_reviews/CustomerReviews';
import FeaturedBrands from '../../components/home_page_componenets/featured_brands/FeaturedBrands';
import FeaturedIn from '../../components/home_page_componenets/featured_in/FeaturedIn';

const HomePage = () => {
  return (
    <div className="home-page">
      <HeroBanner />
      <CategoryList />
      <ShopByPopularDresses />  
      <FindYourColorPalette />
      <CustomerReviews />
      <FeaturedBrands />
      <FeaturedIn />
    </div>
  );
};

export default HomePage;
