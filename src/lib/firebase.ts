
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  "projectId": "lautech-shoppa",
  "appId": "1:453886364219:web:32454a86f9f23e313de218",
  "storageBucket": "lautech-shoppa.appspot.com",
  "apiKey": "AIzaSyAzXF_RkSowk7V5une5S_Hh_eMvM5s-R-Q",
  "authDomain": "lautech-shoppa.firebaseapp.com",
  "messagingSenderId": "453886364219"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
