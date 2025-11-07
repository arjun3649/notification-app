import { db } from "../config/firebase";
import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";

const saveUserToFirestore = async (userId: string, token: string) => {
  try {
    const userRef = doc(collection(db, 'users'), userId);
    
    await setDoc(userRef, {
      name: "Notification User",       // Keep as required
      userId: userId,                  // Add UUID as separate column
      expoPushToken: token,            // Required field
      createdAt: serverTimestamp(),    // Required field
    }, { merge: true });

    console.log('User saved to Firestore');
  } catch (error) {
    console.error('Error saving user to Firestore:', error);
  }
};

export { saveUserToFirestore };
