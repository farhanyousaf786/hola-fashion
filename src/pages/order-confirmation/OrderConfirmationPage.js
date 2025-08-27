import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { db, auth } from '../../firebase/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, collection, getDocs, query, orderBy, limit, collectionGroup, where, documentId } from 'firebase/firestore';
import './OrderConfirmationPage.css';

const OrderConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [orderData, setOrderData] = useState(location.state?.orderData);
  const [loading, setLoading] = useState(false);
  const [allOrders, setAllOrders] = useState([]);

  useEffect(() => {
    let isMounted = true;
    let unsub = () => {};

    async function tryLoad(uid) {
      console.log('[OCP] tryLoad start', { orderId, uid });
      // 1) Try Anonymous path first (works even if user now logged in)
      try {
        const anonId = localStorage.getItem('anon_uid');
        if (anonId) {
          const anonRef = doc(db, 'anonymousOrders', anonId, 'orders', orderId);
          const anonSnap = await getDoc(anonRef);
          if (anonSnap.exists()) {
            console.log('[OCP] Found order in anonymousOrders path');
            return { id: anonSnap.id, ...anonSnap.data(), _owner: { type: 'anon', id: anonId } };
          }
        }
      } catch (e) {
        console.warn('Anon order lookup failed:', e);
      }

      // 2) Try User path if we have a uid
      if (uid) {
        try {
          const userRef = doc(db, 'users', uid, 'orders', orderId);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            console.log('[OCP] Found order in users path');
            return { id: userSnap.id, ...userSnap.data(), _owner: { type: 'user', id: uid } };
          }
        } catch (e) {
          console.warn('User order lookup failed:', e);
        }
      }

      // 3) Fallback: collection group search by document ID
      try {
        const cg = query(collectionGroup(db, 'orders'), where(documentId(), '==', orderId));
        const cgSnaps = await getDocs(cg);
        if (!cgSnaps.empty) {
          const docSnap = cgSnaps.docs[0];
          const path = docSnap.ref.path; // e.g. 'anonymousOrders/<anonId>/orders/<orderId>' or 'users/<uid>/orders/<orderId>'
          let owner = null;
          const parts = path.split('/');
          const idxAnon = parts.indexOf('anonymousOrders');
          const idxUsers = parts.indexOf('users');
          if (idxAnon !== -1 && parts[idxAnon + 1]) owner = { type: 'anon', id: parts[idxAnon + 1] };
          else if (idxUsers !== -1 && parts[idxUsers + 1]) owner = { type: 'user', id: parts[idxUsers + 1] };
          console.log('[OCP] Found order via collectionGroup', { owner, path });
          return { id: docSnap.id, ...docSnap.data(), _owner: owner };
        }
      } catch (e) {
        console.warn('Collection group lookup failed:', e);
      }
      return null;
    }

    async function init() {
      if (orderData || !orderId) return;
      setLoading(true);
      // Wait for auth state, then attempt both lookups
      unsub = onAuthStateChanged(auth, async (user) => {
        try {
          const loaded = await tryLoad(user?.uid);
          if (!isMounted) return;
          if (loaded) {
            console.log('[OCP] Loaded order data', loaded);
            setOrderData(loaded);
          } else {
            console.log('[OCP] No order found for id', orderId);
          }
        } finally {
          if (isMounted) setLoading(false);
        }
      });
    }

    init();
    return () => { isMounted = false; unsub && unsub(); };
  }, [orderId, orderData]);

  // After we know owner (anon/user), load their recent orders list
  useEffect(() => {
    let isMounted = true;
    async function loadAll() {
      if (!orderData?._owner) return;
      try {
        let colRef;
        if (orderData._owner.type === 'anon') {
          colRef = collection(db, 'anonymousOrders', orderData._owner.id, 'orders');
        } else {
          colRef = collection(db, 'users', orderData._owner.id, 'orders');
        }
        const q = query(colRef, orderBy('createdAt', 'desc'), limit(10));
        const snaps = await getDocs(q);
        if (!isMounted) return;
        setAllOrders(snaps.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (e) {
        console.warn('Load all orders failed:', e);
      }
    }
    loadAll();
    return () => { isMounted = false; };
  }, [orderData?._owner]);

  if (!orderData) {
    return (
      <div className="order-confirmation-page">
        <div className="confirmation-container">
          <div className="error-message">
            <h1>Order Not Found</h1>
            <p>{loading ? 'Loading order…' : "We couldn't find your order details."}</p>
            <button onClick={() => navigate('/shop')} className="continue-shopping-btn">
              Continue Shopping
            </button>
          </div>

        {Array.isArray(allOrders) && allOrders.length > 0 && (
          <div className="related-orders">
            <h2>Your recent orders</h2>
            <div className="orders-list">
              {allOrders.map((o) => {
                const ts = o.timestamp || o.createdAt || o.paymentResult?.createdAt || o.paymentResult?.created_at;
                const d = ts && (typeof ts?.toDate === 'function' ? ts.toDate() : new Date(ts));
                const dateText = d && !isNaN(d) ? d.toLocaleString() : '';
                const isCurrent = o.id === orderId || o.orderId === orderId;
                return (
                  <div key={o.id} className={`related-order-item ${isCurrent ? 'current' : ''}`} onClick={() => navigate(`/order-confirmation/${o.id}`)}>
                    <div className="row">
                      <div>
                        <div className="oid">#{o.id}</div>
                        {dateText && <div className="odate">{dateText}</div>}
                      </div>
                      <div className="amt">${(o.total || 0).toFixed(2)}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
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

  // Prefer Firestore createdAt for display
  const candidateTs =
    orderData.createdAt ||
    orderData.timestamp ||
    orderData.paymentResult?.createdAt ||
    orderData.paymentResult?.created_at;

  const resolvedDate = resolveDate(candidateTs) || new Date();
  const orderDateText = resolvedDate.toLocaleString(undefined, { dateStyle: 'long', timeStyle: 'medium' });

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
                <span className="value">{orderId}</span>
              </div>
              <div className="info-item">
                <span className="label">Order Date:</span>
                <span className="value">{orderDateText}</span>
              </div>
              <div className="info-item">
                <span className="label">Total Amount:</span>
                <span className="value">${Number(orderData?.total || 0).toFixed(2)}</span>
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
              <p><strong>{orderData?.customerDetails?.firstName} {orderData?.customerDetails?.lastName}</strong></p>
              <p>{orderData?.customerDetails?.address}</p>
              <p>{orderData?.customerDetails?.city}{orderData?.customerDetails?.state ? `, ${orderData.customerDetails.state}` : ''} {orderData?.customerDetails?.zipCode}</p>
              <p>{orderData?.customerDetails?.email}</p>
              <p>{orderData?.customerDetails?.phone}</p>
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
                      ${Number((item.price || 0) * (item.quantity || 0)).toFixed(2)}
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
              <strong>Total: ${Number(orderData?.total || 0).toFixed(2)}</strong>
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
          {orderData.orderId && (
            <button onClick={() => navigate(`/order/${orderData.orderId}`)} className="print-btn">
              View Order Details
            </button>
          )}
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
