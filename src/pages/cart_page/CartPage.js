import React from 'react';
import { Link } from 'react-router-dom';
import './CartPage.css';
import { useCart } from '../../context/CartContext';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

  const handleQuantityChange = (itemKey, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(itemKey);
    } else {
      updateQuantity(itemKey, newQuantity);
    }
  };

  const handleRemoveItem = (itemKey) => {
    removeFromCart(itemKey);
  };

  const formatPrice = (price) => {
    return `$${price.toFixed(2)} USD`;
  };

  if (cart.items.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-header">
          <h1>CART</h1>
        </div>
        <div className="empty-cart">
          <h2>Your cart is empty</h2>
          <p>Add some items to your cart to see them here.</p>
          <Link to="/shop" className="continue-shopping-btn">
            CONTINUE SHOPPING
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1>CART</h1>
      </div>

      <div className="cart-content">
        <div className="cart-table">
          <div className="cart-table-header">
            <div className="header-product">PRODUCT</div>
            <div className="header-price">PRICE</div>
            <div className="header-quantity">QUANTITY</div>
            <div className="header-total">TOTAL</div>
          </div>

          <div className="cart-items">
            {cart.items.map((item) => (
              <div key={item.key} className="cart-item">
                <button 
                  className="remove-item-btn"
                  onClick={() => handleRemoveItem(item.key)}
                  aria-label="Remove item"
                >
                  ×
                </button>
                
                <div className="item-product">
                  <div className="item-image">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="item-details">
                    <h3 className="item-name">{item.name}</h3>
                    <div className="item-attributes">
                      <div className="item-size">Size: {item.size}</div>
                      <div className="item-color">Color: {item.color}</div>
                    </div>
                  </div>
                </div>

                <div className="item-price">
                  {item.originalPrice && item.originalPrice > item.price && (
                    <div className="original-price">{formatPrice(item.originalPrice)}</div>
                  )}
                  <div className="current-price">{formatPrice(item.price)}</div>
                </div>

                <div className="item-quantity">
                  <button 
                    className="quantity-btn minus"
                    onClick={() => handleQuantityChange(item.key, item.quantity - 1)}
                  >
                    −
                  </button>
                  <span className="quantity-value">{item.quantity}</span>
                  <button 
                    className="quantity-btn plus"
                    onClick={() => handleQuantityChange(item.key, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>

                <div className="item-total">
                  {item.originalPrice && item.originalPrice > item.price && (
                    <div className="original-total">{formatPrice(item.originalPrice * item.quantity)}</div>
                  )}
                  <div className="current-total">{formatPrice(item.price * item.quantity)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="cart-info-section">
          <div className="shipping-info-boxes">
            <div className="info-box">
              <div className="info-icon">
                <img src="/icons/shipping-icon.svg" alt="Free Shipping" />
              </div>
              <div className="info-content">
                <div className="info-title">Free Shipping</div>
                <div className="info-text">Free shipping for orders over $299</div>
                <a href="#" className="info-link">See Details &gt;</a>
              </div>
            </div>

            <div className="info-box">
              <div className="info-icon">
                <img src="/icons/returns-icon.svg" alt="Exchanges & Returns" />
              </div>
              <div className="info-content">
                <div className="info-title">Exchanges & Returns</div>
                <div className="info-text">Easy returns & exchanges within 5 days on eligible items</div>
                <a href="#" className="info-link">See Details &gt;</a>
              </div>
            </div>

            <div className="info-box">
              <div className="info-icon">
                <img src="/icons/price-match-icon.svg" alt="Price Match" />
              </div>
              <div className="info-content">
                <div className="info-title">Price Match</div>
                <div className="info-text">Find a lower price? We'll match it. Exclusions may apply.</div>
                <a href="#" className="info-link">See Details &gt;</a>
              </div>
            </div>

            <div className="info-box">
              <div className="info-icon">
                <img src="/icons/tax-icon.svg" alt="No Tax" />
              </div>
              <div className="info-content">
                <div className="info-title">No Tax</div>
                <div className="info-text">No Sales Tax if shipped outside NY, CA, FL, GA, IL, MI or PA. Save 10%.</div>
                <a href="#" className="info-link">See Details &gt;</a>
              </div>
            </div>
          </div>

          <div className="cart-summary">
            <div className="subtotal">
              <span className="subtotal-label">Subtotal</span>
              <div className="subtotal-prices">
                <span className="subtotal-amount">{formatPrice(getCartTotal())}</span>
              </div>
            </div>

            <button className="checkout-btn">
              PROCEED TO CHECKOUT
            </button>
          </div>

          <div className="trust-section">
            <div className="trust-badges">
              <div className="badge-section">
                <h3>SAFE AND SECURE</h3>
                <div className="payment-badges">
                  <img src="/icons/trust-badge-1.svg" alt="Secure Payment" />
                  <img src="/icons/trust-badge-2.svg" alt="BBB Accredited" />
                </div>
              </div>
              <div className="badge-section">
                <h3>SHOP WITH CONFIDENCE</h3>
                <div className="confidence-badges">
                  <img src="/icons/trust-badge-1.svg" alt="America's Best Online Shops" />
                </div>
              </div>
            </div>
          </div>

          <div className="tariff-notice">
            <h2>Prices Are About to Get All Dressed Up... in Tariffs!</h2>
            <p>Starting next month, some of your favorite designers—like La Femme, Mac Duggal, and Jovani—will be strutting into higher price territory with tariffs up to 25%! But don't panic—our current inventory is still tariff-free.</p>
            <p><strong>So snag your favorites now before costs go up!</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
