import { db, auth } from "../firebase/firebaseConfig";
import { collection, addDoc, serverTimestamp, updateDoc, doc, setDoc } from "firebase/firestore";

export async function saveOrder(orderData) {
  const user = auth.currentUser;
  const timestamp = serverTimestamp();
  let orderRef;

  if (user) {
    // Authenticated user: save under their orders subcollection
    const userOrdersRef = collection(db, "users", user.uid, "orders");
    orderRef = await addDoc(userOrdersRef, {
      ...orderData,
      userId: user.uid,
      createdAt: timestamp,
      isAnonymous: false,
    });
  } else {
    // Anonymous: store as a flat doc at anonymousOrders/{orderId}
    // Keep anonId in the document for correlation, but do not nest under it.
    let anonId = localStorage.getItem("anon_uid");
    if (!anonId) {
      anonId = crypto.randomUUID();
      localStorage.setItem("anon_uid", anonId);
    }
    const newDocRef = doc(collection(db, "anonymousOrders")); // auto-id becomes orderId
    await setDoc(newDocRef, {
      ...orderData,
      anonId,
      createdAt: timestamp,
      isAnonymous: true,
      orderId: newDocRef.id,
    });
    orderRef = newDocRef;
  }
  // orderId is already embedded for both paths (users add later via updateDoc above, anon set inline)
  return orderRef;
}
