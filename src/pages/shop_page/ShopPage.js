import React, { useState, useEffect } from 'react';
import './ShopPage.css';
import FilterSidebar from '../../components/shop_page_components/filter_sidebar/FilterSidebar';
import ProductGrid from '../../components/shop_page_components/product_grid/ProductGrid';
import MobileFilters from '../../components/shop_page_components/mobile_filters/MobileFilters';
import MobileSortBy from '../../components/shop_page_components/mobile_sort_by/MobileSortBy';
import Pagination from '../../components/shop_page_components/pagination/Pagination';

const ShopPage = () => {
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showMobileSortBy, setShowMobileSortBy] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    sale: [],
    size: [],
    color: [],
    designer: [],
    priceRange: []
  });
  const [sortBy, setSortBy] = useState('FEATURED ITEMS');
  const [products, setProducts] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 260; // Mock total pages

  // Mock product data
  const mockProducts = Array(12).fill().map((_, index) => ({
    id: index + 1,
    name: 'Jovani D6018 - Strapless, Sequin Prom Gown',
    price: 990.00,
    image: '/images/product-page-demo-img.png',
    colors: ['pink', 'navy', 'red', 'white'],
    isWishlist: false
  }));

  useEffect(() => {
    setProducts(mockProducts);
  }, [mockProducts]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMobileFilters = () => {
    setShowMobileFilters(!showMobileFilters);
    if (showMobileSortBy) setShowMobileSortBy(false);
  };

  const toggleMobileSortBy = () => {
    setShowMobileSortBy(!showMobileSortBy);
    if (showMobileFilters) setShowMobileFilters(false);
  };

  const handleFilterChange = (filterType, value, isChecked) => {
    setSelectedFilters(prevFilters => {
      const updatedFilters = { ...prevFilters };
      
      if (isChecked) {
        updatedFilters[filterType] = [...updatedFilters[filterType], value];
      } else {
        updatedFilters[filterType] = updatedFilters[filterType].filter(item => item !== value);
      }
      
      return updatedFilters;
    });
  };

  const handleSortChange = (sortOption) => {
    setSortBy(sortOption);
    if (showMobileSortBy) setShowMobileSortBy(false);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const totalProducts = 1020; // Mock total products count

  return (
    <div className="shop-page">
      <div className="shop-header">
        <div className="breadcrumb">
          <a href="/">Home</a> &gt; <a href="/dresses">Dresses</a> &gt; <span>Wedding</span>
        </div>
        <h1 className="page-title">Wedding Dresses</h1>
      </div>

      <div className="shop-content">
        {!isMobile && (
          <FilterSidebar 
            selectedFilters={selectedFilters} 
            onFilterChange={handleFilterChange} 
          />
        )}

        <div className="product-section">
          <div className="results-header">
            <div className="results-count">
              RESULTS ({totalProducts} Products)
            </div>
            <div className="sort-by">
              <span className="sort-label">SORT BY: </span>
              <div className="sort-dropdown">
                <span>{sortBy}</span>
                <span className="dropdown-arrow">▼</span>
                <div className="sort-options">
                  <div onClick={() => handleSortChange('BEST SELLING')}>BEST SELLING</div>
                  <div onClick={() => handleSortChange('FEATURED ITEMS')}>FEATURED ITEMS</div>
                  <div onClick={() => handleSortChange('PRICE (LOW TO HIGH)')}>PRICE (LOW TO HIGH)</div>
                  <div onClick={() => handleSortChange('PRICE (HIGH TO LOW)')}>PRICE (HIGH TO LOW)</div>
                  <div onClick={() => handleSortChange('NAME (A-Z)')}>NAME (A-Z)</div>
                  <div onClick={() => handleSortChange('NAME (Z-A)')}>NAME (Z-A)</div>
                  <div onClick={() => handleSortChange('DATE: OLD TO NEW')}>DATE: OLD TO NEW</div>
                  <div onClick={() => handleSortChange('DATE: NEW TO OLD')}>DATE: NEW TO OLD</div>
                </div>
              </div>
            </div>
          </div>

          {isMobile && (
            <div className="mobile-filter-sort">
              <button className="filter-button" onClick={toggleMobileFilters}>
                FILTERS ({Object.values(selectedFilters).flat().length})
              </button>
              <button className="sort-button" onClick={toggleMobileSortBy}>
                SORT BY: {sortBy}
              </button>
            </div>
          )}

          <ProductGrid products={products} />
          
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />

          {isMobile && showMobileFilters && (
            <MobileFilters 
              selectedFilters={selectedFilters} 
              onFilterChange={handleFilterChange} 
              onClose={toggleMobileFilters}
              totalProducts={totalProducts}
            />
          )}

          {isMobile && showMobileSortBy && (
            <MobileSortBy 
              currentSort={sortBy} 
              onSortChange={handleSortChange} 
              onClose={toggleMobileSortBy} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
