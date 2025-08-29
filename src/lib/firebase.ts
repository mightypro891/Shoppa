
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  "projectId": "naija-shoppa",
  "appId": "1:137647070211:web:b0d277643206bf226ac236",
  "storageBucket": "naija-shoppa.firebasestorage.app",
  "apiKey": "AIzaSyCGHpCReIV5n-b4FXynO4NPybvNDTT9c6w",
  "authDomain": "naija-shoppa.firebaseapp.com",
  "messagingSenderId": "137647070211"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
