
import { initializeApp, getApps, getApp, App } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';
import admin from 'firebase-admin';

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

// --- Server-side Admin SDK Initialization ---
if (typeof window === 'undefined' && !admin.apps.length) {
    try {
        const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_CONFIG!);
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            storageBucket: firebaseConfig.storageBucket,
        });
        console.log('Firebase Admin SDK initialized successfully.');
    } catch (error: any) {
        console.error('Error initializing Firebase Admin SDK:', error.message);
         if (!process.env.FIREBASE_ADMIN_CONFIG) {
            console.error("FIREBASE_ADMIN_CONFIG environment variable is not set. Please follow the setup instructions.");
        }
    }
}

const adminDb = admin.apps.length ? admin.firestore() : null;
const adminAuth = admin.apps.length ? admin.auth() : null;
const adminStorage = admin.apps.length ? admin.storage() : null;


export { 
    app, 
    auth, 
    storage, 
    db, 
    adminDb, 
    adminAuth, 
    adminStorage 
};
