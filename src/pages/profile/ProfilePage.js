import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // If not authenticated, redirect to auth page
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth?from=profile');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (!isAuthenticated || !user) {
    return null; // Will redirect in useEffect
  }

  const displayName = user?.name || user?.displayName || (user?.email ? user.email.split('@')[0] : '');
  const createdAt = (() => {
    const v = user?.createdAt;
    if (!v) return '';
    if (typeof v === 'string' || typeof v === 'number') {
      const d = new Date(v);
      return isNaN(d) ? '' : d.toLocaleDateString();
    }
    // Firestore Timestamp
    if (v?.seconds) {
      const d = new Date(v.seconds * 1000);
      return d.toLocaleDateString();
    }
    return '';
  })();

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            <img src="/icons/profile-icon.svg" alt="Profile" className="avatar-icon" />
          </div>
          <div className="header-texts">
            <h1>HELLO {displayName ? displayName.toUpperCase() : 'THERE'}</h1>
            <p className="muted">{user?.email}</p>
          </div>
        </div>

        <div className="profile-layout">
          <aside className="profile-sidebar">
            <button className="sidebar-item active" type="button">Account Information</button>
            <button className="sidebar-item" type="button" onClick={() => navigate('/orders')}>My Orders</button>
            <button className="sidebar-item" type="button" onClick={() => navigate('/address-book')}>Address Book</button>
            <button className="sidebar-item" type="button" onClick={() => navigate('/wishlist')}>My Wishlist</button>
            <button className="sidebar-item" type="button">Change Password</button>
            <button className="sidebar-item danger" type="button" onClick={handleLogout}>Log Out</button>
          </aside>

          <main className="profile-content">
            <div className="content-header">
              <h2>Account Information</h2>
            </div>
            <div className="fields">
              <div className="field-row">
                <span className="field-label">Name</span>
                <span className="field-value">{displayName || '—'}</span>
              </div>
              <div className="field-row">
                <span className="field-label">Email Address:</span>
                <span className="field-value">{user?.email || '—'}</span>
              </div>
            </div>

            <div className="content-actions">
              <button className="btn-edit" onClick={() => navigate('/account')}>Edit</button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
