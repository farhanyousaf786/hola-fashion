import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase/firebaseConfig';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from './ToastContext';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showError, showSuccess } = useToast();

  const friendlyAuthError = (error) => {
    const code = (error?.code || '').toString();
    switch (code) {
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/missing-password':
        return 'Please enter your password.';
      case 'auth/wrong-password':
        return 'Incorrect password.';
      case 'auth/user-not-found':
        return 'No account found with this email.';
      case 'auth/email-already-in-use':
        return 'This email is already registered.';
      case 'auth/weak-password':
        return 'Password must be at least 6 characters.';
      default:
        return error?.message || 'Something went wrong. Please try again.';
    }
  };

  // Keep auth state in sync with Firebase Auth
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        // Load profile from Firestore if present
        try {
          const userRef = doc(db, 'users', fbUser.uid);
          const snap = await getDoc(userRef);
          const profile = snap.exists() ? snap.data() : {};
          const merged = {
            uid: fbUser.uid,
            email: fbUser.email,
            displayName: fbUser.displayName || profile.name || '',
            photoURL: fbUser.photoURL || profile.photoURL || null,
            ...profile
          };
          setUser(merged);
          setIsAuthenticated(true);
          localStorage.setItem('holaFashionUser', JSON.stringify(merged));
        } catch (e) {
          // Fallback to basic auth user
          const basic = { uid: fbUser.uid, email: fbUser.email, displayName: fbUser.displayName || '' };
          setUser(basic);
          setIsAuthenticated(true);
          localStorage.setItem('holaFashionUser', JSON.stringify(basic));
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('holaFashionUser');
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const login = async (emailOrObj, password) => {
    // Support both login(email, password) and login({ email, password })
    let rawEmail = emailOrObj;
    let rawPassword = password;
    if (emailOrObj && typeof emailOrObj === 'object') {
      rawEmail = emailOrObj.email;
      rawPassword = emailOrObj.password;
    }
    const e = typeof rawEmail === 'string' ? rawEmail.trim() : '';
    const p = typeof rawPassword === 'string' ? rawPassword.trim() : '';
    if (!e || !p) {
      showError('Please enter both email and password.');
      throw new Error('Email and password are required');
    }
    try {
      const cred = await signInWithEmailAndPassword(auth, e, p);
      return cred.user;
    } catch (err) {
      showError(friendlyAuthError(err));
      throw err;
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  // userData should include: { name, email, password }
  const register = async (userData) => {
    const { email, password, name } = userData || {};
    const e = (email || '').trim();
    const p = (password || '').trim();
    const n = (name || '').trim();
    if (!e || !p) {
      showError('Please provide email and password to sign up.');
      throw new Error('Email and password are required');
    }
    if (p.length < 6) {
      showError('Password must be at least 6 characters.');
      throw new Error('Password must be at least 6 characters');
    }
    try {
      // Create auth user
      const cred = await createUserWithEmailAndPassword(auth, e, p);
      // Optionally set displayName
      if (n) {
        try { await updateProfile(cred.user, { displayName: n }); } catch {}
      }
      // Create Firestore user profile under users/{uid}
      const userRef = doc(db, 'users', cred.user.uid);
      const profile = {
        uid: cred.user.uid,
        email: e,
        name: n || '',
        createdAt: serverTimestamp()
      };
      await setDoc(userRef, profile, { merge: true });
      showSuccess('Account created successfully.');
      return cred.user;
    } catch (err) {
      showError(friendlyAuthError(err));
      throw err;
    }
  };

  const value = {
    isAuthenticated,
    user,
    login,
    logout,
    register,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
