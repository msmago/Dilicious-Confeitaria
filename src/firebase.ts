import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Import the Firebase configuration
import firebaseConfig from '../firebase-applet-config.json';

// Firebase configuration with environment variable support for Vercel
const finalConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || firebaseConfig.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || firebaseConfig.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || firebaseConfig.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || firebaseConfig.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseConfig.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || firebaseConfig.appId,
};

// Initialize Firebase SDK
const app = initializeApp(finalConfig);
export const db = getFirestore(app, (import.meta.env.VITE_FIREBASE_DATABASE_ID || firebaseConfig.firestoreDatabaseId) || '(default)');
export const auth = getAuth();
export const storage = getStorage(app);

// Validate Connection to Firestore
async function testConnection() {
  try {
    // Attempt to get a dummy document to test connection
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log("Firebase connection successful.");
  } catch (error: any) {
    console.error("Firebase Connection Error:", error);
    if (error?.message?.includes('the client is offline')) {
      console.error("Please check your Firebase configuration. The client is offline. This often means the Project ID or API Key is incorrect, or the database is not provisioned.");
    }
  }
}

testConnection();
