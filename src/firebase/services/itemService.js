import { collection, getDocs, doc, getDoc, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { ItemModel } from '../../models/ItemModel';

// Collection reference
const ITEMS_COLLECTION = 'items';

/**
 * Get all items from Firestore
 * @returns {Promise<ItemModel[]>} - Array of items
 */
export const getAllItems = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, ITEMS_COLLECTION));
    return querySnapshot.docs.map(doc => ItemModel.fromFirebase(doc.id, doc.data()));
  } catch (error) {
    console.error('Error getting all items:', error);
    throw error;
  }
};

/**
 * Get a single item by ID
 * @param {string} id - The item ID
 * @returns {Promise<ItemModel|null>} - The item or null if not found
 */
export const getItemById = async (id) => {
  try {
    const docRef = doc(db, ITEMS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return ItemModel.fromFirebase(docSnap.id, docSnap.data());
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting item by ID:', error);
    throw error;
  }
};

/**
 * Get featured items
 * @param {number} limitCount - Maximum number of items to return
 * @returns {Promise<ItemModel[]>} - Array of featured items
 */
export const getFeaturedItems = async (limitCount = 8) => {
  try {
    const q = query(
      collection(db, ITEMS_COLLECTION),
      where('featured', '==', true),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const items = querySnapshot.docs.map(doc => ItemModel.fromFirebase(doc.id, doc.data()));
    
    // Sort by createdAt client-side (temporary fix until index is created)
    return items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (error) {
    console.error('Error getting featured items:', error);
    throw error;
  }
};

/**
 * Get items by category
 * @param {string} category - The category to filter by
 * @returns {Promise<ItemModel[]>} - Array of items in the category
 */
export const getItemsByCategory = async (category) => {
  try {
    const q = query(
      collection(db, ITEMS_COLLECTION),
      where('category', '==', category)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ItemModel.fromFirebase(doc.id, doc.data()));
  } catch (error) {
    console.error('Error getting items by category:', error);
    throw error;
  }
};

/**
 * Get items by header category (navigation categories)
 * @param {string} headerCategory - The header category to filter by
 * @returns {Promise<ItemModel[]>} - Array of items in the header category
 */
export const getItemsByHeaderCategory = async (headerCategory) => {
  try {
    const q = query(
      collection(db, ITEMS_COLLECTION),
      where('headerCategory', '==', headerCategory)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ItemModel.fromFirebase(doc.id, doc.data()));
  } catch (error) {
    console.error('Error getting items by header category:', error);
    throw error;
  }
};

/**
 * Get items by sub-header category
 * @param {string} headerCategory - The header category (prom, hoco, wedding, etc.)
 * @param {string} subHeaderCategory - The sub-header category to filter by
 * @returns {Promise<ItemModel[]>} - Array of items in the sub-header category
 */
export const getItemsBySubHeaderCategory = async (headerCategory, subHeaderCategory) => {
  try {
    const q = query(
      collection(db, ITEMS_COLLECTION),
      where('headerCategory', '==', headerCategory),
      where('subHeaderCategory', '==', subHeaderCategory)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ItemModel.fromFirebase(doc.id, doc.data()));
  } catch (error) {
    console.error(`Error getting items by sub-header category ${headerCategory}/${subHeaderCategory}:`, error);
    throw error;
  }
};

/**
 * Get items by gender
 * @param {string} gender - The gender to filter by (men, women, unisex)
 * @returns {Promise<ItemModel[]>} - Array of items for the gender
 */
export const getItemsByGender = async (gender) => {
  try {
    const q = query(
      collection(db, ITEMS_COLLECTION),
      where('gender', '==', gender)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ItemModel.fromFirebase(doc.id, doc.data()));
  } catch (error) {
    console.error('Error getting items by gender:', error);
    throw error;
  }
};

/**
 * Get items by multiple filters
 * @param {Object} filters - Object containing filter criteria
 * @returns {Promise<ItemModel[]>} - Array of filtered items
 */
export const getItemsByFilters = async (filters = {}) => {
  try {
    let q = collection(db, ITEMS_COLLECTION);
    
    // Apply filters
    const queryConstraints = [];
    
    if (filters.gender) {
      queryConstraints.push(where('gender', '==', filters.gender));
    }
    
    if (filters.category) {
      queryConstraints.push(where('category', '==', filters.category));
    }
    
    if (filters.headerCategory) {
      queryConstraints.push(where('headerCategory', '==', filters.headerCategory));
    }
    
    if (filters.featured !== undefined) {
      queryConstraints.push(where('featured', '==', filters.featured));
    }
    
    // Add ordering
    queryConstraints.push(orderBy('createdAt', 'desc'));
    
    // Add limit if specified
    if (filters.limit) {
      queryConstraints.push(limit(filters.limit));
    }
    
    q = query(q, ...queryConstraints);
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ItemModel.fromFirebase(doc.id, doc.data()));
  } catch (error) {
    console.error('Error getting items by filters:', error);
    throw error;
  }
};

/**
 * Search items by name or description
 * @param {string} searchTerm - The search term
 * @returns {Promise<ItemModel[]>} - Array of matching items
 */
export const searchItems = async (searchTerm) => {
  try {
    // Get all items and filter client-side (Firestore doesn't support full-text search)
    const allItems = await getAllItems();
    const searchTermLower = searchTerm.toLowerCase();
    
    return allItems.filter(item => 
      item.name.toLowerCase().includes(searchTermLower) ||
      item.description.toLowerCase().includes(searchTermLower) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchTermLower))
    );
  } catch (error) {
    console.error('Error searching items:', error);
    throw error;
  }
};
