import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDgVSkx9xnTwmdOmmjJJBKZHvlALVXys6k",
  authDomain: "projetofei-45e05.firebaseapp.com",
  projectId: "projetofei-45e05",
  storageBucket: "projetofei-45e05.firebasestorage.app",
  messagingSenderId: "931341159931",
  appId: "1:931341159931:web:f40fa302a9f59e6bb44f5e",
  measurementId: "G-9Z8GQKWWVT"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const db = initializeFirestore(app, {
  experimentalAutoDetectLongPolling: true,
});

const auth = getAuth(app);

export { app, db, auth };
