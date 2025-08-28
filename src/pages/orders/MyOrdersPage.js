import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';
import { useAuth } from '../../context/AuthContext';
import './MyOrdersPage.css';

const MyOrdersPage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let aborted = false;

    async function load() {
      if (!isAuthenticated || !user?.uid) {
        setLoading(false);
        setOrders([]);
        return;
      }
      setLoading(true);
      setError('');
      try {
        const q = query(
          collection(db, 'users', user.uid, 'orders'),
          orderBy('createdAt', 'desc')
        );
        const snap = await getDocs(q);
        if (aborted) return;
        const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setOrders(list);
      } catch (e) {
        console.error('[MyOrders] load error', e);
        setError(e.message || 'Failed to load orders');
      } finally {
        if (!aborted) setLoading(false);
      }
    }

    load();
    return () => { aborted = true; };
  }, [isAuthenticated, user?.uid]);

  if (!isAuthenticated) {
    return (
      <div className="orders-page">
        <div className="orders-container">
          <h1>My Orders</h1>
          <p>Please log in to view your orders.</p>
          <button className="orders-btn" onClick={() => navigate('/auth')}>Go to Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-container">
        <h1>My Orders</h1>

        {loading && <p>Loading orders…</p>}
        {error && !loading && <p className="orders-error">{error}</p>}

        {!loading && !error && orders.length === 0 && (
          <div className="orders-empty">
            <p>You have no orders yet.</p>
            <Link className="orders-btn" to="/shop">Start Shopping</Link>
          </div>
        )}

        {!loading && !error && orders.length > 0 && (
          <div className="orders-list">
            {orders.map(order => {
              // Normalize items count whether array or object-map
              let itemCount = 0;
              if (Array.isArray(order.items)) itemCount = order.items.length;
              else if (order.items && typeof order.items === 'object') itemCount = Object.keys(order.items).length;

              const createdAt = order.createdAt?.seconds
                ? new Date(order.createdAt.seconds * 1000)
                : (order.timestamp?.seconds ? new Date(order.timestamp.seconds * 1000) : null);

              return (
                <Link
                  to={`/order-confirmation/${user.uid}/${order.id}`}
                  className="order-card"
                  key={order.id}
                >
                  <div className="order-card-top">
                    <div>
                      <div className="order-id">Order #{order.id}</div>
                      {createdAt && (
                        <div className="order-date">{createdAt.toLocaleString()}</div>
                      )}
                    </div>
                    <div className="order-status">{order.status || 'confirmed'}</div>
                  </div>
                  <div className="order-card-bottom">
                    <div className="order-items-count">{itemCount} item{itemCount === 1 ? '' : 's'}</div>
                    <div className="order-total">${Number(order.total || 0).toFixed(2)}</div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrdersPage;
