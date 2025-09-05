
import { initializeApp, getApps, getApp, App } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

// --- Client-side Firebase config ---
const firebaseConfig = {
  "projectId": "naija-shoppa",
  "appId": "1:137647070211:web:b0d277643206bf226ac236",
  "storageBucket": "naija-shoppa.appspot.com",
  "apiKey": "AIzaSyCGHpCReIV5n-b4FXynO4NPybvNDTT9c6w",
  "authDomain": "naija-shoppa.firebaseapp.com",
  "messagingSenderId": "137647070211"
};

// --- Client-side App Initialization ---
const app: App = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app);

// Server-side admin SDK is no longer used to simplify the setup
const adminDb = null;
const adminAuth = null;
const adminStorage = null;


export { 
    app, 
    auth, 
    storage, 
    db, 
    adminDb, 
    adminAuth, 
    adminStorage 
};
