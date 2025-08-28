import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../firebase/firebaseConfig';
import { useToast } from './ToastContext';
import { collection, doc, setDoc, deleteDoc, getDocs, serverTimestamp } from 'firebase/firestore';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const { user, isAuthenticated } = useAuth();
  const { showError } = useToast();

  // Keep Firestore payloads clean: remove undefined and non-serializable values
  const sanitizeForFirestore = (obj) => {
    const out = {};
    Object.entries(obj || {}).forEach(([k, v]) => {
      if (v === undefined) return; // drop undefined
      if (typeof v === 'function') return; // drop functions
      out[k] = v;
    });
    return out;
  };

  // Load wishlist from Firestore when user logs in
  useEffect(() => {
    const load = async () => {
      if (isAuthenticated && user?.uid) {
        try {
          const colRef = collection(db, 'users', user.uid, 'wishlist');
          const snap = await getDocs(colRef);
          const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
          setWishlistItems(items);
        } catch (e) {
          // Fallback: start empty if Firestore fails
          setWishlistItems([]);
          showError(`Failed to load wishlist. ${e?.code || e?.message || ''}`);
        }
      } else {
        setWishlistItems([]);
      }
    };
    load();
  }, [isAuthenticated, user?.uid]);

  // Optionally keep a lightweight local cache keyed by uid
  useEffect(() => {
    if (isAuthenticated && user?.uid) {
      localStorage.setItem(`wishlist_${user.uid}`, JSON.stringify(wishlistItems));
    }
  }, [wishlistItems, isAuthenticated, user?.uid]);

  const addToWishlist = async (product) => {
    if (!isAuthenticated || !user?.uid) return false;
    const exists = wishlistItems.some(item => item.id === product.id);
    if (exists) return false;
    // Optimistic update
    setWishlistItems(prev => [...prev, product]);
    try {
      const docRef = doc(db, 'users', user.uid, 'wishlist', product.id.toString());
      // Persist a minimal, safe snapshot of the product
      const payload = sanitizeForFirestore({
        id: product.id?.toString?.() ?? String(product.id),
        name: product.name || '',
        price: typeof product.price === 'number' ? product.price : Number(product.price) || 0,
        image: product.image || product.thumbnail || product.img || '',
        slug: product.slug || undefined,
        addedAt: serverTimestamp()
      });
      await setDoc(docRef, payload, { merge: true });
    } catch (e) {
      // Revert on failure
      setWishlistItems(prev => prev.filter(i => i.id !== product.id));
      showError(`Failed to save to wishlist. ${e?.code || e?.message || ''}`);
      console.error('Wishlist Firestore write failed:', e);
      return false;
    }
    return true;
  };

  const removeFromWishlist = async (productId) => {
    // Optimistic update
    setWishlistItems(prev => prev.filter(item => item.id !== productId));
    try {
      if (isAuthenticated && user?.uid) {
        const docRef = doc(db, 'users', user.uid, 'wishlist', productId.toString());
        await deleteDoc(docRef);
      }
    } catch (e) {
      // ignore; UI already updated
      showError(`Failed to remove from wishlist. ${e?.code || e?.message || ''}`);
    }
  };

  const toggleWishlist = async (product) => {
    if (!isAuthenticated) return false;
    const inList = wishlistItems.some(item => item.id === product.id);
    if (inList) {
      await removeFromWishlist(product.id);
      return false;
    } else {
      return await addToWishlist(product);
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item.id === productId);
  };

  const getWishlistCount = () => {
    return wishlistItems.length;
  };

  const clearWishlist = () => {
    setWishlistItems([]);
  };

  const value = {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    getWishlistCount,
    clearWishlist
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};
