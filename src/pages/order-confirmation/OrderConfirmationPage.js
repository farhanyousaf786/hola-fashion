import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './OrderConfirmationPage.css';

const OrderConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderData = location.state?.orderData;

  if (!orderData) {
    return (
      <div className="order-confirmation-page">
        <div className="confirmation-container">
          <div className="error-message">
            <h1>Order Not Found</h1>
            <p>We couldn't find your order details.</p>
            <button onClick={() => navigate('/shop')} className="continue-shopping-btn">
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Resolve a robust display date
  const resolveDate = (ts) => {
    try {
      if (!ts) return null;
      // Firestore Timestamp
      if (typeof ts === 'object' && typeof ts.toDate === 'function') return ts.toDate();
      // Square created_at string (ISO) or any ISO string
      if (typeof ts === 'string') {
        const d = new Date(ts);
        return isNaN(d.getTime()) ? null : d;
      }
      // Epoch ms or number-like
      if (typeof ts === 'number') {
        const d = new Date(ts);
        return isNaN(d.getTime()) ? null : d;
      }
      return null;
    } catch {
      return null;
    }
  };

  const candidateTs =
    orderData.timestamp ||
    orderData.createdAt ||
    orderData.paymentResult?.createdAt ||
    orderData.paymentResult?.created_at;

  const resolvedDate = resolveDate(candidateTs) || new Date();
  const orderDateText = resolvedDate.toLocaleString();

  return (
    <div className="order-confirmation-page">
      <div className="confirmation-container">
        <div className="success-header">
          <div className="success-icon">✓</div>
          <h1>Order Confirmed!</h1>
          <p>Thank you for your purchase. Your order has been successfully placed.</p>
        </div>

        <div className="order-details">
          <div className="order-info">
            <h2>Order Information</h2>
            <div className="info-grid">
              <div className="info-item">
                <span className="label">Order ID:</span>
                <span className="value">{orderData.paymentResult?.paymentId || 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="label">Order Date:</span>
                <span className="value">{orderDateText}</span>
              </div>
              <div className="info-item">
                <span className="label">Total Amount:</span>
                <span className="value">${orderData.total.toFixed(2)}</span>
              </div>
              <div className="info-item">
                <span className="label">Payment Status:</span>
                <span className="value status-confirmed">Confirmed</span>
              </div>
            </div>
          </div>

          <div className="shipping-info">
            <h2>Shipping Information</h2>
            <div className="shipping-address">
              <p><strong>{orderData.customerDetails.firstName} {orderData.customerDetails.lastName}</strong></p>
              <p>{orderData.customerDetails.address}</p>
              <p>{orderData.customerDetails.city}, {orderData.customerDetails.state} {orderData.customerDetails.zipCode}</p>
              <p>{orderData.customerDetails.email}</p>
              <p>{orderData.customerDetails.phone}</p>
            </div>
          </div>

          <div className="order-items">
            <h2>Order Items</h2>
            <div className="items-list">
              {Array.isArray(orderData.items) && orderData.items.length > 0 ? (
                orderData.items.map((item, index) => (
                  <div key={index} className="order-item">
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
                ))
              ) : (
                <div className="order-item">
                  <p>No items found in this order.</p>
                </div>
              )}
            </div>
            <div className="order-total">
              <strong>Total: ${orderData.total.toFixed(2)}</strong>
            </div>
          </div>
        </div>

        <div className="next-steps">
          <h2>What's Next?</h2>
          <div className="steps-grid">
            <div className="step">
              <div className="step-icon">📧</div>
              <h3>Confirmation Email</h3>
              <p>You'll receive an order confirmation email shortly at {orderData.customerDetails.email}</p>
            </div>
            <div className="step">
              <div className="step-icon">📦</div>
              <h3>Processing</h3>
              <p>Your order will be processed within 1-2 business days</p>
            </div>
            <div className="step">
              <div className="step-icon">🚚</div>
              <h3>Shipping</h3>
              <p>You'll receive tracking information once your order ships</p>
            </div>
          </div>
        </div>

        <div className="action-buttons">
          <button onClick={() => navigate('/shop')} className="continue-shopping-btn">
            Continue Shopping
          </button>
          <button onClick={() => window.print()} className="print-btn">
            Print Receipt
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
