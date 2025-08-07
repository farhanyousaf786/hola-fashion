import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header/Header';
import HomePage from './pages/home_page/HomePage';
import ShopPage from './pages/shop_page/ShopPage';
import ProductPage from './pages/product-page/ProductPage';
import Footer from './components/footer/Footer';



function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/product/:productId" element={<ProductPage />} />
            
            {/* Header Category Pages - using ShopPage */}
            <Route path="/prom" element={<ShopPage />} />
            <Route path="/hoco" element={<ShopPage />} />
            <Route path="/wedding" element={<ShopPage />} />
            <Route path="/wedding-guest" element={<ShopPage />} />
            <Route path="/bridesmaid" element={<ShopPage />} />
            <Route path="/mother-of-bride" element={<ShopPage />} />
            <Route path="/quince" element={<ShopPage />} />
            <Route path="/formal" element={<ShopPage />} />
            <Route path="/others" element={<ShopPage />} />
            
            {/* Other pages */}
            <Route path="/account" element={<ShopPage category="account" />} />
            <Route path="/wishlist" element={<ShopPage category="wishlist" />} />
            <Route path="/cart" element={<ShopPage category="cart" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
