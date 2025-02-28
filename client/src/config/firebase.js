import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Make sure these values are correctly set from your .env file
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// For debugging
console.log('Firebase config:', {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY ? process.env.REACT_APP_FIREBASE_API_KEY.substring(0, 5) + '...' : 'Not set',
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN ? 'Set' : 'Not set',
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID ? 'Set' : 'Not set'
});

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);