// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";


// --- PROTOTYPE NOTE ---
// This file uses placeholder credentials. To connect to a real Firebase backend,
// you must replace these with your project's actual configuration.
// However, the rest of the application is currently configured to use
// in-memory data for demonstration purposes.

const firebaseConfig = {
  "projectId": "naija-shoppa",
  "appId": "1:137647070211:web:b0d277643206bf226ac236",
  "storageBucket": "naija-shoppa.firebasestorage.app",
  "apiKey": "AIzaSyCGHpCReIV5n-b4FXynO4NPybvNDTT9c6w",
  "authDomain": "naija-shoppa.firebaseapp.com",
  "messagingSenderId": "137647070211"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);


export { app, db, auth, storage };