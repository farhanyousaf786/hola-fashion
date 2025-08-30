import { db, auth } from "../firebase/firebaseConfig";
import { collection, addDoc, serverTimestamp, doc, setDoc } from "firebase/firestore";
// Email will be sent from the backend

export async function saveOrder(orderData) {
  const user = auth.currentUser;
  const timestamp = serverTimestamp();
  let orderRef;

  console.log('Starting order save process...');
  
  try {
    if (user) {
      console.log('Saving order for authenticated user:', user.uid);
      const userOrdersRef = collection(db, "users", user.uid, "orders");
      orderRef = await addDoc(userOrdersRef, {
        ...orderData,
        userId: user.uid,
        createdAt: timestamp,
        isAnonymous: false,
      });
    } else {
      console.log('Saving anonymous order');
      let anonId = localStorage.getItem("anon_uid");
      if (!anonId) {
        anonId = crypto.randomUUID();
        localStorage.setItem("anon_uid", anonId);
      }
      const newDocRef = doc(collection(db, "anonymousOrders"));
      await setDoc(newDocRef, {
        ...orderData,
        anonId,
        createdAt: timestamp,
        isAnonymous: true,
        orderId: newDocRef.id,
      });
      orderRef = newDocRef;
    }

    console.log('Order saved successfully. Order ID:', orderRef.id);
    
    // Prepare email data
    const emailData = {
      ...orderData,
      orderId: orderRef.id,
      items: orderData.items || []
    };

    // Send confirmation email via backend
    const email = orderData.customerDetails?.email;
    
    if (email) {
      try {
        console.log('Sending order confirmation email to:', email);
        const response = await fetch('http://localhost:3001/api/email/order-confirmation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email,
            orderData: {
              ...orderData,
              orderId: orderRef.id
            }
          }),
        });

        const result = await response.json();
        if (!response.ok) {
          console.error('Failed to send email:', result.message);
        } else {
          console.log('✅ Order confirmation email sent successfully');
        }
      } catch (error) {
        console.error('Error sending email:', error);
      }
    } else {
      console.warn('⚠️ No email address found in order data. Email not sent.');
    }

    return orderRef;
    
  } catch (error) {
    console.error('❌ Error in saveOrder:', error);
    throw error; // Re-throw to be handled by the caller
  }
}
