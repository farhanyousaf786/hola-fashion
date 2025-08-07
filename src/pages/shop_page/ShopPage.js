import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import './ShopPage.css';
import FilterSidebar from '../../components/shop_page_components/filter_sidebar/FilterSidebar';
import ProductGrid from '../../components/shop_page_components/product_grid/ProductGrid';
import MobileFilters from '../../components/shop_page_components/mobile_filters/MobileFilters';
import MobileSortBy from '../../components/shop_page_components/mobile_sort_by/MobileSortBy';
import Pagination from '../../components/shop_page_components/pagination/Pagination';
import { getItemsByHeaderCategory, getAllItems } from '../../firebase/services/itemService';

const ShopPage = ({ category }) => {
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const location = useLocation();
  const params = useParams();

  // Scroll to top when page loads or category changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [category, params.category, location.pathname]);

  // Fetch products from Firebase
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get category from props, URL params, or location pathname
        const currentCategory = category || params.category || location.pathname.slice(1);
        
        let items = [];
        
        if (currentCategory && currentCategory !== 'shop' && currentCategory !== 'account' && currentCategory !== 'wishlist' && currentCategory !== 'cart') {
          // Fetch items by header category
          items = await getItemsByHeaderCategory(currentCategory);
        } else {
          // Fetch all items for general shop page
          items = await getAllItems();
        }
        
        // Convert ItemModel instances to product format expected by ProductGrid
        const formattedProducts = items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          originalPrice: item.originalPrice,
          image: item.images && item.images.length > 0 ? item.images[0] : 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg',
          colors: item.colors || [],
          isWishlist: false,
          brand: item.brand,
          category: item.category,
          headerCategory: item.headerCategory,
          subHeaderCategory: item.subHeaderCategory,
          featured: item.featured,
          stock: item.stock
        }));
        
        setProducts(formattedProducts);
        
        // Calculate pagination
        const itemsPerPage = 12;
        setTotalPages(Math.ceil(formattedProducts.length / itemsPerPage));
        
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [category, params.category, location.pathname]);

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

  // Get current category from props, URL params, or location pathname
  const currentCategory = category || params.category || location.pathname.slice(1) || 'shop';
  
  // Format category for display (capitalize, replace hyphens with spaces)
  const formatCategory = (cat) => {
    return cat
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  const displayCategory = formatCategory(currentCategory);
  const totalProducts = products.length;
  
  // Special handling for certain categories
  const getCategoryTitle = () => {
    if (currentCategory === 'account') return 'My Account';
    if (currentCategory === 'wishlist') return 'My Wishlist';
    if (currentCategory === 'cart') return 'Shopping Cart';
    return `${displayCategory} Dresses`;
  };
  
  // Loading state
  if (loading) {
    return (
      <div className="shop-page">
        <div className="shop-header">
          <div className="breadcrumb">
            <a href="/">Home</a> &gt; <a href="/dresses">Dresses</a> &gt; <span>{displayCategory}</span>
          </div>
          <h1 className="page-title">{getCategoryTitle()}</h1>
        </div>
        <div className="loading-container" style={{ textAlign: 'center', padding: '4rem 0' }}>
          <div className="loading-spinner" style={{ 
            width: '50px', 
            height: '50px', 
            border: '4px solid #f3f3f3', 
            borderTop: '4px solid #007bff', 
            borderRadius: '50%', 
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="shop-page">
        <div className="shop-header">
          <div className="breadcrumb">
            <a href="/">Home</a> &gt; <a href="/dresses">Dresses</a> &gt; <span>{displayCategory}</span>
          </div>
          <h1 className="page-title">{getCategoryTitle()}</h1>
        </div>
        <div className="error-container" style={{ textAlign: 'center', padding: '4rem 0' }}>
          <p style={{ color: '#dc3545', fontSize: '1.1rem', marginBottom: '1rem' }}>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            style={{ 
              padding: '0.75rem 2rem', 
              background: '#007bff', 
              color: 'white', 
              border: 'none', 
              borderRadius: '6px', 
              cursor: 'pointer' 
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="shop-page">
      <div className="shop-header">
        <div className="breadcrumb">
          <a href="/">Home</a> &gt; <a href="/dresses">Dresses</a> &gt; <span>{displayCategory}</span>
        </div>
        <h1 className="page-title">{getCategoryTitle()}</h1>
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
