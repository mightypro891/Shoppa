
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
let adminDb: admin.firestore.Firestore;
let adminAuth: admin.auth.Auth;
let adminStorage: admin.storage.Storage;

if (typeof window === 'undefined') { // Ensure this runs only on the server
    try {
        if (!admin.apps.length) {
            const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_CONFIG || '{}');
             admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                storageBucket: firebaseConfig.storageBucket,
            });
        }
        adminDb = admin.firestore();
        adminAuth = admin.auth();
        adminStorage = admin.storage();
    } catch (error) {
        console.error('Firebase Admin SDK initialization error:', error);
        // Set to null if initialization fails to avoid crashes
        adminDb = null as any;
        adminAuth = null as any;
        adminStorage = null as any;
    }
}


export { 
    app, 
    auth, 
    storage, 
    db,
    adminDb,
    adminAuth,
    adminStorage,
};
