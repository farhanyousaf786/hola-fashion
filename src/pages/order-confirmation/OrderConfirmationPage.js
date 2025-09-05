import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { db, auth } from '../../firebase/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, collection, getDocs, query, orderBy, limit, collectionGroup, where, documentId } from 'firebase/firestore';
import './OrderConfirmationPage.css';

const OrderConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Support routes like /order-confirmation/:orderId and /order-confirmation/:uid/:orderId
  const { orderId, uid } = useParams();
  const [orderData, setOrderData] = useState(location.state?.orderData);
  const [loading, setLoading] = useState(false);
  const [allOrders, setAllOrders] = useState([]);

  // Debug: log full order data whenever it changes
  useEffect(() => {
    if (orderData) {
      try {
        console.log('[OCP] orderData (state object):', orderData);
        console.log('[OCP] orderData (JSON):', JSON.stringify(orderData, null, 2));
      } catch {}
    }
  }, [orderData]);

  useEffect(() => {
    let isMounted = true;
    let unsub = () => {};

    async function tryLoad(authUid) {
      console.log('[OCP] tryLoad start', { orderId, uid });
      // -1) New flat anonymous path: anonymousOrders/{orderId}
      try {
        const flatAnonRef = doc(db, 'anonymousOrders', orderId);
        const flatAnonSnap = await getDoc(flatAnonRef);
        if (flatAnonSnap.exists()) {
          console.log('[OCP] Found order in flat anonymousOrders path');
          return { id: flatAnonSnap.id, ...flatAnonSnap.data(), _owner: { type: 'anon_flat' } };
        }
      } catch (e) {
        console.warn('Flat anon order lookup failed:', e);
      }
      // 0) If uid is provided in URL, try that path first
      if (uid && orderId) {
        try {
          const userRef = doc(db, 'users', uid, 'orders', orderId);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            console.log('[OCP] Found order using URL uid');
            return { id: userSnap.id, ...userSnap.data(), _owner: { type: 'user', id: uid } };
          }
        } catch (e) {
          console.warn('URL uid order lookup failed:', e);
        }
      }
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
      if (authUid) {
        try {
          const userRef = doc(db, 'users', authUid, 'orders', orderId);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            console.log('[OCP] Found order in users path');
            return { id: userSnap.id, ...userSnap.data(), _owner: { type: 'user', id: authUid } };
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
      if (!orderId) return;
      // If we already have data, don't fetch again
      if (orderData) return;
      setLoading(true);
      // Wait for auth state, then attempt both lookups
      unsub = onAuthStateChanged(auth, async (user) => {
        try {
          // If we already have rich data with items, we can skip. Otherwise, try to load/merge.
          const hasItems = Array.isArray(orderData?.items) && orderData.items.length > 0;
          const loaded = hasItems ? null : await tryLoad(user?.uid);
          if (!isMounted) return;
          if (loaded) {
            console.log('[OCP] Loaded order data', loaded);
            setOrderData(prev => ({ ...(prev || {}), ...loaded }));
          } else {
            if (!orderData) console.log('[OCP] No order found for id', orderId);
            // Server-side fallback: fetch via backend so links work on any device
            try {
              const res = await fetch(`/api/orders/${orderId}`);
              if (res.ok) {
                const data = await res.json();
                if (isMounted) {
                  console.log('[OCP] Fetched order via server fallback');
                  setOrderData(prev => ({ ...(prev || {}), ...data }));
                }
              } else {
                const txt = await res.text();
                console.log('[OCP] Server fallback not found', txt);
              }
            } catch (e) {
              console.warn('[OCP] Server fallback failed', e);
            }
          }
        } finally {
          if (isMounted) setLoading(false);
        }
      });
    }

    init();
    return () => { isMounted = false; unsub && unsub(); };
  }, [orderId]);

  // After we know owner (anon/user), load their recent orders list (once per owner id)
  const lastOwnerLoadedRef = React.useRef(null);
  useEffect(() => {
    let isMounted = true;
    async function loadAll() {
      const owner = orderData?._owner;
      if (!owner?.id) return;
      // Do not try to load recent orders for flat anonymous docs
      if (owner.type === 'anon_flat') return;
      const ownerKey = `${owner.type}:${owner.id}`;
      if (lastOwnerLoadedRef.current === ownerKey) return;
      lastOwnerLoadedRef.current = ownerKey;
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

  // Build a carrier tracking URL from known carriers if backend didn't store one
  const buildTrackingUrl = (shipping) => {
    try {
      if (!shipping) return null;
      if (shipping.tracking_url) return shipping.tracking_url;
      const num = shipping.tracking_number;
      const carrier = (shipping.carrier || '').toUpperCase();
      if (!num) return null;
      switch (carrier) {
        case 'USPS':
          return `https://tools.usps.com/go/TrackConfirmAction_input?origTrackNum=${encodeURIComponent(num)}`;
        case 'UPS':
          return `https://www.ups.com/track?loc=en_US&tracknum=${encodeURIComponent(num)}`;
        case 'FEDEX':
          return `https://www.fedex.com/fedextrack/?trknbr=${encodeURIComponent(num)}`;
        case 'DHL':
          return `https://www.dhl.com/global-en/home/tracking/tracking-express.html?submit=1&tracking-id=${encodeURIComponent(num)}`;
        default:
          return null;
      }
    } catch {
      return null;
    }
  };

  const shipping = orderData?.shipping || orderData?.shippingInfo || null;
  const trackingUrl = buildTrackingUrl(shipping);

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

          {shipping && (shipping.tracking_number || shipping.label_url || shipping.status) && (
            <div className="shipment-status">
              <h2>Shipment Status</h2>
              <div className="info-grid">
                {shipping.status && (
                  <div className="info-item">
                    <span className="label">Status:</span>
                    <span className="value">{String(shipping.status).toUpperCase()}</span>
                  </div>
                )}
                {shipping.carrier && (
                  <div className="info-item">
                    <span className="label">Carrier:</span>
                    <span className="value">{shipping.carrier}</span>
                  </div>
                )}
                {shipping.service && (
                  <div className="info-item">
                    <span className="label">Service:</span>
                    <span className="value">{shipping.service}</span>
                  </div>
                )}
                {shipping.tracking_number && (
                  <div className="info-item">
                    <span className="label">Tracking #:</span>
                    <span className="value">{shipping.tracking_number}</span>
                  </div>
                )}
              </div>

              <div className="action-buttons">
                {trackingUrl && (
                  <button className="print-btn" onClick={() => window.open(trackingUrl, '_blank')}>Track Package</button>
                )}
                {shipping.label_url && (
                  <button className="print-btn" onClick={() => window.open(shipping.label_url, '_blank')}>View Shipping Label (PDF)</button>
                )}
              </div>
            </div>
          )}

          <div className="order-items">
            <h2>Order Items</h2>
            <div className="items-list">
              {(() => {
                // Build a robust items list: prefer saved items; else derive from Square payment result if present
                // Saved items might be an array or an object map (e.g., {"0": {...}})
                let savedItems = [];
                if (Array.isArray(orderData.items)) {
                  savedItems = orderData.items;
                } else if (orderData.items && typeof orderData.items === 'object') {
                  savedItems = Object.values(orderData.items);
                }
                let displayItems = savedItems;
                if (!displayItems.length) {
                  try {
                    const pr = orderData?.paymentResult;
                    // Square can return: order.lineItems or order.line_items depending on source
                    const lineItems = pr?.order?.lineItems || pr?.order?.line_items || pr?.order?.line_items?.elements || [];
                    if (Array.isArray(lineItems) && lineItems.length) {
                      displayItems = lineItems.map(li => ({
                        name: li.name || li.item?.name || 'Item',
                        quantity: Number(li.quantity || li.qty || 1),
                        price: Number(li.basePriceMoney?.amount || li.price || li.totalMoney?.amount || 0) / (li.basePriceMoney?.currency || li.totalMoney?.currency ? 100 : 1),
                        image: li.imageUrl || li.image_url || '',
                        selectedSize: li.metadata?.size || li.size || undefined,
                        selectedColor: li.metadata?.color || li.color || undefined,
                      }));
                    }
                  } catch {}
                }
                // Fallback 2: Some orders seem to store a single product at top level (name, price, quantity, size, color)
                if (!displayItems.length) {
                  const top = orderData || {};
                  if (top && (top.name || top.price || top.quantity)) {
                    displayItems = [{
                      name: top.name || 'Item',
                      quantity: Number(top.quantity || 1),
                      price: Number(top.price || 0),
                      image: top.image || top.img || '',
                      selectedSize: top.size || top.selectedSize,
                      selectedColor: top.color || top.selectedColor,
                    }];
                  }
                }
                // Silence noisy derived items log to avoid console spam
                return displayItems && displayItems.length ? (
                  displayItems.map((item, index) => (
                    <div key={index} className="order-item">
                      <img src={item.image || item.img || ''} alt={item.name || 'Item'} />
                      <div className="item-details">
                        <h3>{item.name || 'Item'}</h3>
                        <p>Size: {item.selectedSize || item.size}</p>
                        <p>Color: {item.selectedColor || item.color}</p>
                        <p>Quantity: {item.quantity}</p>
                      </div>
                      <div className="item-price">
                        ${Number(((item.price ?? 0)) * (item.quantity || 0)).toFixed(2)}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="order-item">
                    <p>No items found in this order.</p>
                  </div>
                );
              })()}
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
