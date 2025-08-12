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

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!isAuthenticated || !user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            <img 
              src="/icons/profile-icon.svg" 
              alt="Profile" 
              className="avatar-icon"
            />
          </div>
          <h1>My Profile</h1>
        </div>

        <div className="profile-content">
          <div className="profile-section">
            <h2>Account Information</h2>
            <div className="info-grid">
              <div className="info-item">
                <label>Full Name</label>
                <p>{user.name}</p>
              </div>
              <div className="info-item">
                <label>Email</label>
                <p>{user.email}</p>
              </div>
              <div className="info-item">
                <label>Member Since</label>
                <p>{new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h2>Account Actions</h2>
            <div className="action-buttons">
              <button className="btn-secondary" onClick={() => navigate('/wishlist')}>
                View Wishlist
              </button>
              <button className="btn-secondary" onClick={() => navigate('/cart')}>
                View Cart
              </button>
              <button className="btn-secondary" onClick={() => navigate('/shop')}>
                Continue Shopping
              </button>
            </div>
          </div>

          <div className="profile-section">
            <h2>Account Settings</h2>
            <div className="settings-actions">
              <button className="btn-outline">Edit Profile</button>
              <button className="btn-outline">Change Password</button>
              <button className="btn-danger" onClick={handleLogout}>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
