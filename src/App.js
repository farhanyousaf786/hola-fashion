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
            <Route path="/wedding" element={<ShopPage />} />
            <Route path="/dresses/wedding" element={<ShopPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
