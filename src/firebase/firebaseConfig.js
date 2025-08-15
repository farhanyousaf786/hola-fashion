// Firebase configuration
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDysWfcXJGRPq2mxYP5cEyE4_cQawOuPv8",
  authDomain: "hola-fashion.firebaseapp.com",
  projectId: "hola-fashion",
  storageBucket: "hola-fashion.firebasestorage.app",
  messagingSenderId: "113967607669",
  appId: "1:113967607669:web:f5aa00feafd8f20c9c2d3c",
  measurementId: "G-YZ4PC2887J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics with error handling
let analytics = null;
try {
  if (typeof window !== 'undefined' && navigator.onLine) {
    analytics = getAnalytics(app);
  }
} catch (error) {
  console.warn('Firebase Analytics initialization failed:', error);
}

const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { app, analytics, db, storage, auth };
