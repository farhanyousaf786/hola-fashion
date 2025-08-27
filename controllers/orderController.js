const admin = require('firebase-admin');

function initAdmin() {
  if (admin.apps.length) return;
  const saJson = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!saJson) {
    console.warn('[orderController] FIREBASE_SERVICE_ACCOUNT not set; attempting default credentials');
    try {
      admin.initializeApp();
      return;
    } catch (e) {
      console.error('[orderController] Failed to init admin with default credentials:', e.message);
      throw new Error('Firebase Admin not configured. Set FIREBASE_SERVICE_ACCOUNT');
    }
  }
  try {
    const serviceAccount = JSON.parse(saJson);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (e) {
    console.error('[orderController] Invalid FIREBASE_SERVICE_ACCOUNT JSON:', e.message);
    throw e;
  }
}

async function getOrderById(req, res) {
  try {
    initAdmin();
    const { orderId } = req.params;
    if (!orderId) return res.status(400).json({ error: 'orderId required' });

    const db = admin.firestore();
    // Prefer a query on a dedicated field to avoid documentId() path constraints
    let snap = await db
      .collectionGroup('orders')
      .where('orderId', '==', orderId)
      .limit(1)
      .get();

    if (snap.empty) return res.status(404).json({ error: 'Not found' });

    const docSnap = snap.docs[0];
    const data = docSnap.data();
    const path = docSnap.ref.path; // users/{uid}/orders/{orderId} OR anonymousOrders/{anonId}/orders/{orderId}

    let owner = null;
    const parts = path.split('/');
    const idxAnon = parts.indexOf('anonymousOrders');
    const idxUsers = parts.indexOf('users');
    if (idxAnon !== -1 && parts[idxAnon + 1]) owner = { type: 'anon', id: parts[idxAnon + 1] };
    if (idxUsers !== -1 && parts[idxUsers + 1]) owner = { type: 'user', id: parts[idxUsers + 1] };

    return res.json({ id: docSnap.id, ...data, _owner: owner });
  } catch (e) {
    console.error('[orderController] getOrderById error:', e);
    return res.status(500).json({ error: 'Server error' });
  }
}

module.exports = { getOrderById };
