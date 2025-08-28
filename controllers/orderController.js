const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

function initAdmin() {
  if (admin.apps.length) return;
  const saJson = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (saJson) {
    try {
      const serviceAccount = JSON.parse(saJson);
      admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
      return;
    } catch (e) {
      console.error('[orderController] Invalid FIREBASE_SERVICE_ACCOUNT JSON:', e.message);
      throw e;
    }
  }

  // Try GOOGLE_APPLICATION_CREDENTIALS file path explicitly
  const gacPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (gacPath) {
    try {
      const abs = path.isAbsolute(gacPath) ? gacPath : path.join(process.cwd(), gacPath);
      const raw = fs.readFileSync(abs, 'utf8');
      const serviceAccount = JSON.parse(raw);
      admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
      return;
    } catch (e) {
      console.error('[orderController] Failed to init admin from GOOGLE_APPLICATION_CREDENTIALS:', e.message);
      // continue to default attempt below
    }
  }

  // Try local serviceAccount.json in project root as fallback (development)
  try {
    const candidates = [
      path.join(process.cwd(), 'serviceAccount.json'),
      path.join(__dirname, '..', 'serviceAccount.json')
    ];
    for (const p of candidates) {
      if (fs.existsSync(p)) {
        const raw = fs.readFileSync(p, 'utf8');
        const serviceAccount = JSON.parse(raw);
        admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
        console.warn('[orderController] Initialized admin from local serviceAccount.json');
        return;
      }
    }
  } catch (e) {
    console.error('[orderController] Local serviceAccount fallback failed:', e.message);
  }

  console.warn('[orderController] No explicit credentials found; attempting default ADC');
  admin.initializeApp();
}

async function getOrderById(req, res) {
  try {
    initAdmin();
    const { orderId } = req.params;
    if (!orderId) return res.status(400).json({ error: 'orderId required' });

    const db = admin.firestore();
    // 1) Prefer a query on a dedicated field to avoid documentId() path constraints
    let snap = await db
      .collectionGroup('orders')
      .where('orderId', '==', orderId)
      .limit(1)
      .get();

    // 2) Fallback: search by Firestore document ID if no explicit 'orderId' field exists
    if (snap.empty) {
      try {
        const FieldPath = admin.firestore.FieldPath;
        snap = await db
          .collectionGroup('orders')
          .where(FieldPath.documentId(), '==', orderId)
          .limit(1)
          .get();
      } catch (e) {
        console.error('[orderController] documentId fallback failed:', e);
      }
    }

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
