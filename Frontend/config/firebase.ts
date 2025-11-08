import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import Constants from 'expo-constants';

// Get values from app.json extra
const EXTRA = Constants.expoConfig?.extra || {};

const firebaseConfig = {
  apiKey: EXTRA.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: EXTRA.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: EXTRA.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: EXTRA.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: EXTRA.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: EXTRA.EXPO_PUBLIC_FIREBASE_APP_ID,
};

//  Prevent reinitializing Firebase (important for Expo reloads)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

//  Export Firestore instance
export const db = getFirestore(app);
