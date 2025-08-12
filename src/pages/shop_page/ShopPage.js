import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useSearchParams } from 'react-router-dom';
import './ShopPage.css';
import FilterSidebar from '../../components/shop_page_components/filter_sidebar/FilterSidebar';
import ProductGrid from '../../components/shop_page_components/product_grid/ProductGrid';
import MobileFilters from '../../components/shop_page_components/mobile_filters/MobileFilters';
import MobileSortBy from '../../components/shop_page_components/mobile_sort_by/MobileSortBy';
import Pagination from '../../components/shop_page_components/pagination/Pagination';
import { getItemsByHeaderCategory, getAllItems, searchItems } from '../../firebase/services/itemService';

const ShopPage = ({ category }) => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search');
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
  const [dynamicFilters, setDynamicFilters] = useState({
    sizes: [],
    colors: [],
    brands: [],
    categories: [],
    priceRanges: []
  });
  
  const location = useLocation();
  const params = useParams();

  // Function to extract dynamic filter data from products
  const extractDynamicFilters = (products) => {
    const sizes = new Set();
    const colors = new Set();
    const brands = new Set();
    const categories = new Set();
    const prices = [];

    products.forEach(product => {
      // Extract sizes
      if (product.sizes && Array.isArray(product.sizes)) {
        product.sizes.forEach(size => sizes.add(size));
      }

      // Extract colors
      if (product.colors && Array.isArray(product.colors)) {
        product.colors.forEach(color => colors.add(color));
      }

      // Extract brands
      if (product.brand) {
        brands.add(product.brand);
      }

      // Extract categories
      if (product.category) {
        categories.add(product.category);
      }

      // Collect prices for price range calculation
      if (product.price) {
        prices.push(product.price);
      }
    });

    // Fixed price ranges
    const priceRanges = [
      { id: 'under-100', label: 'UNDER $100', min: 0, max: 99 },
      { id: '100-200', label: '$100 - $200', min: 100, max: 200 },
      { id: '200-300', label: '$200 - $300', min: 200, max: 300 },
      { id: '300-400', label: '$300 - $400', min: 300, max: 400 },
      { id: '400-500', label: '$400 - $500', min: 400, max: 500 },
      { id: 'above-500', label: 'ABOVE $500', min: 500, max: Infinity }
    ];

    return {
      sizes: Array.from(sizes).sort(),
      colors: Array.from(colors).sort(),
      brands: Array.from(brands).sort(),
      categories: Array.from(categories).sort(),
      priceRanges
    };
  };

  // Scroll to top when page loads or category changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [category, params.category, location.pathname]);

  // Handle URL parameters for color filtering
  useEffect(() => {
    const colorParam = searchParams.get('color');
    const colorNameParam = searchParams.get('colorName');
    
    if (colorParam) {
      // Apply color filter when color parameter is present in URL
      setSelectedFilters(prevFilters => ({
        ...prevFilters,
        color: [colorParam]
      }));
    }
  }, [searchParams]);

  // Fetch products from Firebase
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get category from props, URL params, or location pathname
        const currentCategory = category || params.category || location.pathname.slice(1);
        
        let items = [];
        
        if (searchQuery) {
          // Handle search query - search by product name, category, or description
          items = await searchItems(searchQuery);
        } else if (currentCategory && currentCategory !== 'shop' && currentCategory !== 'account' && currentCategory !== 'wishlist' && currentCategory !== 'cart') {
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
        
        // Extract and set dynamic filters
        const filters = extractDynamicFilters(formattedProducts);
        setDynamicFilters(filters);
        
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
  }, [category, params.category, location.pathname, searchQuery]);

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

  // Filter products based on selected filters
  const getFilteredProducts = () => {
    let filtered = [...products];

    // Filter by size
    if (selectedFilters.size.length > 0) {
      filtered = filtered.filter(product => 
        product.sizes && product.sizes.some(size => 
          selectedFilters.size.includes(size.toLowerCase())
        )
      );
    }

    // Filter by color
    if (selectedFilters.color.length > 0) {
      filtered = filtered.filter(product => 
        product.colors && product.colors.some(color => 
          selectedFilters.color.includes(color.toLowerCase())
        )
      );
    }

    // Filter by designer/brand
    if (selectedFilters.designer.length > 0) {
      filtered = filtered.filter(product => 
        product.brand && selectedFilters.designer.includes(
          product.brand.toLowerCase().replace(/\s+/g, '-')
        )
      );
    }

    // Filter by price range
    if (selectedFilters.priceRange.length > 0) {
      console.log('Price filtering active. Selected ranges:', selectedFilters.priceRange);
      console.log('Sample product prices:', filtered.slice(0, 3).map(p => ({ name: p.name, price: p.price, type: typeof p.price })));
      
      filtered = filtered.filter(product => {
        const price = parseFloat(product.price) || 0;
        const matches = selectedFilters.priceRange.some(rangeId => {
          switch (rangeId) {
            case 'under-100':
              return price < 100;
            case '100-200':
              return price >= 100 && price <= 200;
            case '200-300':
              return price >= 200 && price <= 300;
            case '300-400':
              return price >= 300 && price <= 400;
            case '400-500':
              return price >= 400 && price <= 500;
            case 'above-500':
              return price > 500;
            default:
              return true;
          }
        });
        
        if (matches) {
          console.log(`Product "${product.name}" matches price filter. Price: ${price}`);
        }
        
        return matches;
      });
      
      console.log('Products after price filtering:', filtered.length);
    }

    return filtered;
  };

  const handleSortChange = (sortOption) => {
    setSortBy(sortOption);
    if (showMobileSortBy) setShowMobileSortBy(false);
  };

  // Dynamic sorting function
  const sortProducts = (products, sortOption) => {
    const sortedProducts = [...products];
    
    switch (sortOption) {
      case 'BEST SELLING':
        // Sort by sales count (assuming higher sales = better selling)
        return sortedProducts.sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0));
      
      case 'FEATURED ITEMS':
        // Sort by featured flag first, then by creation date
        return sortedProducts.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        });
      
      case 'PRICE (LOW TO HIGH)':
        return sortedProducts.sort((a, b) => {
          const priceA = a.discountPrice || a.price || 0;
          const priceB = b.discountPrice || b.price || 0;
          return priceA - priceB;
        });
      
      case 'PRICE (HIGH TO LOW)':
        return sortedProducts.sort((a, b) => {
          const priceA = a.discountPrice || a.price || 0;
          const priceB = b.discountPrice || b.price || 0;
          return priceB - priceA;
        });
      
      case 'NAME (A-Z)':
        return sortedProducts.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      
      case 'NAME (Z-A)':
        return sortedProducts.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
      
      case 'DATE: OLD TO NEW':
        return sortedProducts.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
      
      case 'DATE: NEW TO OLD':
        return sortedProducts.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      
      default:
        return sortedProducts;
    }
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
  const filteredProducts = sortProducts(getFilteredProducts(), sortBy);
  const totalProducts = filteredProducts.length;
  
  // Special handling for certain categories
  const getCategoryTitle = () => {
    const colorNameParam = searchParams.get('colorName');
    
    if (currentCategory === 'account') return 'My Account';
    if (currentCategory === 'wishlist') return 'My Wishlist';
    if (currentCategory === 'cart') return 'Shopping Cart';
    
    // If color filtering is active, show color-specific title
    if (colorNameParam) {
      return colorNameParam;
    }
    
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
            dynamicFilters={dynamicFilters}
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

          <ProductGrid products={filteredProducts} />
          
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
              dynamicFilters={dynamicFilters}
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
