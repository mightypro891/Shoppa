
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  "projectId": "lautech-shoppa-669b3",
  "appId": "1:333904583155:web:32a933a8868623758b99d6",
  "storageBucket": "lautech-shoppa-669b3.appspot.com",
  "apiKey": "AIzaSyDFf3J_v5vscSTqL6A8o9n2fA9zD9SVO24",
  "authDomain": "lautech-shoppa-669b3.firebaseapp.com",
  "messagingSenderId": "333904583155"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
