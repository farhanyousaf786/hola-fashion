import React, { useState, useEffect, useRef } from 'react';
import './SquarePaymentForm.css';

const SquarePaymentForm = ({ 
  total, 
  onPaymentSuccess, 
  onPaymentError, 
  isProcessing, 
  customerDetails 
}) => {
  const [isSquareLoaded, setIsSquareLoaded] = useState(false);
  const [paymentForm, setPaymentForm] = useState(null);
  const [cardButton, setCardButton] = useState(null);
  const cardContainerRef = useRef(null);

  // Square configuration - you'll need to replace these with your actual Square credentials
  const SQUARE_APPLICATION_ID = process.env.REACT_APP_SQUARE_APPLICATION_ID || 'sandbox-sq0idb-YOUR_APP_ID';
  const SQUARE_LOCATION_ID = process.env.REACT_APP_SQUARE_LOCATION_ID || 'YOUR_LOCATION_ID';
  const SQUARE_ENVIRONMENT = process.env.REACT_APP_SQUARE_ENVIRONMENT || 'sandbox';

  useEffect(() => {
    const initializeSquare = async () => {
      try {
        // Load Square Web SDK
        if (!window.Square) {
          const script = document.createElement('script');
          script.src = 'https://sandbox.web.squarecdn.com/v1/square.js';
          script.async = true;
          script.onload = () => {
            setIsSquareLoaded(true);
          };
          document.head.appendChild(script);
        } else {
          setIsSquareLoaded(true);
        }
      } catch (error) {
        console.error('Failed to load Square SDK:', error);
        onPaymentError('Failed to load payment system');
      }
    };

    initializeSquare();
  }, [onPaymentError]);

  useEffect(() => {
    const setupPaymentForm = async () => {
      if (!isSquareLoaded || !window.Square) return;

      try {
        const payments = window.Square.payments(SQUARE_APPLICATION_ID, SQUARE_LOCATION_ID);
        const paymentRequest = payments.paymentRequest({
          countryCode: 'US',
          currencyCode: 'USD',
          total: {
            amount: Math.round(total * 100).toString(), // Convert to cents
            label: 'Total'
          }
        });

        const form = await payments.card({
          style: {
            input: {
              fontSize: '16px',
              fontFamily: 'Arial, sans-serif'
            },
            '.input-container': {
              borderColor: '#E0E0E0',
              borderRadius: '8px'
            },
            '.input-container.is-focus': {
              borderColor: '#ff4d4d'
            },
            '.input-container.is-error': {
              borderColor: '#ff0000'
            }
          }
        });
        await form.attach(cardContainerRef.current);
        
        setPaymentForm(form);

      } catch (error) {
        console.error('Failed to initialize Square payment form:', error);
        onPaymentError('Failed to initialize payment form');
      }
    };

    setupPaymentForm();

    return () => {
      if (paymentForm) {
        paymentForm.destroy();
      }
    };
  }, [isSquareLoaded, total, isProcessing]);

  const handlePayment = async (form) => {
    if (isProcessing) return;

    try {
      // Validate customer details
      const requiredFields = ['firstName', 'lastName', 'email', 'address', 'city', 'state', 'zipCode'];
      const missingFields = requiredFields.filter(field => !customerDetails[field] || customerDetails[field].trim() === '');
      
      if (missingFields.length > 0) {
        console.log('Customer details:', customerDetails);
        console.log('Missing fields:', missingFields);
        onPaymentError(`Please fill in all required fields: ${missingFields.join(', ')}`);
        return;
      }

      // Tokenize the payment method
      const result = await form.tokenize();
      
      if (result.status === 'OK') {
        // Create payment request for backend
        const paymentData = {
          token: result.token,
          amount: Math.round(total * 100), // Convert to cents
          currency: 'USD',
          customerDetails: customerDetails,
          idempotencyKey: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        };

        // TODO: Send to Firebase Function for processing
        // For now, simulate successful payment
        console.log('Payment data to be sent to backend:', paymentData);
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        onPaymentSuccess({
          paymentId: `sq-payment-${Date.now()}`,
          amount: total,
          status: 'COMPLETED',
          token: result.token
        });

      } else {
        console.error('Tokenization failed:', result.errors);
        onPaymentError(result.errors?.[0]?.message || 'Payment failed');
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      onPaymentError('Payment processing failed. Please try again.');
    }
  };

  return (
    <div className="square-payment-form">
      {isSquareLoaded ? (
        <div>
          <div ref={cardContainerRef} className="card-container" />
          <button
            className="square-payment-button"
            disabled={isProcessing}
            onClick={async (e) => {
              e.preventDefault();
              if (!paymentForm || isProcessing) return;
              handlePayment(paymentForm);
            }}
          >
            {isProcessing ? (
              <span className="spinner" style={{marginRight:8,verticalAlign:'middle'}}></span>
            ) : null}
            {isProcessing ? 'Processing...' : `Pay $${total.toFixed(2)}`}
          </button>
          <div className="payment-security">
            <div className="security-badges">
              <span className="security-badge">🔒 Secure Payment</span>
              <span className="security-badge">💳 All Cards Accepted</span>
            </div>
            <p className="security-text">
              Your payment information is encrypted and secure. We never store your card details.
            </p>
          </div>
        </div>
      ) : (
        <div className="loading-payment">
          <div className="spinner" />
          <p>Loading payment form...</p>
        </div>
      )}
    </div>
  );
};

export default SquarePaymentForm;
