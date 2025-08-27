import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header/Header';
import HomePage from './pages/home_page/HomePage';
import ShopPage from './pages/shop_page/ShopPage';
import ProductPage from './pages/product-page/ProductPage';
import CartPage from './pages/cart_page/CartPage';
import CheckoutPage from './pages/checkout/CheckoutPage';
import OrderConfirmationPage from './pages/order-confirmation/OrderConfirmationPage';
import AuthPage from './pages/auth/AuthPage';
import ProfilePage from './pages/profile/ProfilePage';
import WishlistPage from './pages/wishlist/WishlistPage';
import TermsConditions from './pages/legal/TermsConditions';
import PrivacyPolicy from './pages/legal/PrivacyPolicy';
import ReturnPolicy from './pages/legal/ReturnPolicy';
import Footer from './components/footer/Footer';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import { ToastProvider } from './context/ToastContext';



function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
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
              
              {/* Auth and Other pages */}
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/account" element={<ShopPage category="account" />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
              <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
              
              {/* Legal Pages */}
              <Route path="/terms-conditions" element={<TermsConditions />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/return-policy" element={<ReturnPolicy />} />
            </Routes>
            </main>
            <Footer />
          </div>
            </Router>
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
