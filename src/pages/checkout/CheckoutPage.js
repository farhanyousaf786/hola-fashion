import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import SquarePaymentForm from '../../components/payment/SquarePaymentForm';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, getCartTotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { showSuccess, showError } = useToast();
  
  const [orderDetails, setOrderDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US'
  });
  
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Redirect if cart is empty
    if (cart.items.length === 0) {
      navigate('/shop');
      return;
    }
    
    // Pre-fill user details if authenticated
    if (isAuthenticated && user) {
      setOrderDetails(prev => ({
        ...prev,
        email: user.email || '',
        firstName: user.displayName?.split(' ')[0] || '',
        lastName: user.displayName?.split(' ')[1] || ''
      }));
    }
  }, [cart.items, navigate, isAuthenticated, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePaymentSuccess = async (paymentResult) => {
    setIsProcessing(true);
    
    try {
      // Create order object
      // Sanitize order data
      function removeUndefined(obj) {
        if (!obj || typeof obj !== 'object') return obj;
        return Object.fromEntries(
          Object.entries(obj)
            .filter(([_, v]) => v !== undefined)
            .map(([k, v]) => [k, typeof v === 'object' && v !== null ? removeUndefined(v) : v])
        );
      }
      const { serverTimestamp } = await import('firebase/firestore');
      const orderData = removeUndefined({
        items: cart.items,
        total: getCartTotal(),
        customerDetails: removeUndefined(orderDetails),
        paymentResult: removeUndefined(paymentResult),
        timestamp: serverTimestamp(),
        status: 'confirmed'
      });

      // Save order to Firestore (user or anonymous)
      const { saveOrder } = await import('../../firebase/saveOrder');
      const orderRef = await saveOrder(orderData);
      orderData.orderId = orderRef.id;

      // Clear cart and show success
      clearCart();
      showSuccess('Order placed successfully!');
      navigate('/order-confirmation', { state: { orderData } });
      
    } catch (error) {
      console.error('Order processing error:', error);
      showError('Failed to process order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentError = (error) => {
    console.error('Payment error:', error);
    showError('Payment failed. Please try again.');
  };

  if (cart.items.length === 0) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <h1>Checkout</h1>
        
        <div className="checkout-content">
          {/* Order Summary */}
          <div className="order-summary">
            <h2>Order Summary</h2>
            <div className="cart-items">
              {cart.items.map(item => (
                <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="cart-item">
                  <img src={item.image} alt={item.name} />
                  <div className="item-details">
                    <h3>{item.name}</h3>
                    <p>Size: {item.selectedSize}</p>
                    <p>Color: {item.selectedColor}</p>
                    <p>Quantity: {item.quantity}</p>
                  </div>
                  <div className="item-price">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
            <div className="order-total">
              <h3>Total: ${getCartTotal().toFixed(2)}</h3>
            </div>
          </div>

          {/* Right Side: Shipping + Payment */}
          <div className="right-section">
            <div className="customer-details">
              <h2>Shipping Information</h2>
              <form className="details-form">
                <div className="form-row">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={orderDetails.firstName}
                    onChange={handleInputChange}
                    required
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={orderDetails.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={orderDetails.email}
                  onChange={handleInputChange}
                  required
                />
                
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={orderDetails.phone}
                  onChange={handleInputChange}
                  required
                />
                
                <input
                  type="text"
                  name="address"
                  placeholder="Street Address"
                  value={orderDetails.address}
                  onChange={handleInputChange}
                  required
                />
                
                <div className="form-row">
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={orderDetails.city}
                    onChange={handleInputChange}
                    required
                  />
                  <input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={orderDetails.state}
                    onChange={handleInputChange}
                    required
                  />
                  <input
                    type="text"
                    name="zipCode"
                    placeholder="ZIP Code"
                    value={orderDetails.zipCode}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </form>
            </div>

            <div className="payment-section">
              <h2>Payment Information</h2>
              <SquarePaymentForm
                total={getCartTotal()}
                onPaymentSuccess={handlePaymentSuccess}
                onPaymentError={handlePaymentError}
                isProcessing={isProcessing}
                customerDetails={orderDetails}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
