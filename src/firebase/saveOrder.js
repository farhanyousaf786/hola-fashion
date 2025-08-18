import { db, auth } from "../firebase/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

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
    // Anonymous: generate anon UID (or use provided anonId)
    let anonId = localStorage.getItem("anon_uid");
    if (!anonId) {
      anonId = crypto.randomUUID();
      localStorage.setItem("anon_uid", anonId);
    }
    const anonOrdersRef = collection(db, "anonymousOrders", anonId, "orders");
    orderRef = await addDoc(anonOrdersRef, {
      ...orderData,
      anonId,
      createdAt: timestamp,
      isAnonymous: true,
    });
  }
  return orderRef;
}
