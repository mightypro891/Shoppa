
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  "projectId": "lautech-shoppa-4",
  "appId": "1:932976563602:web:97305929665a20de735624",
  "storageBucket": "lautech-shoppa-4.appspot.com",
  "apiKey": "AIzaSyAz_-_y9WfALgD8dc7sc-5uoqZhjVbOSdE",
  "authDomain": "lautech-shoppa-4.firebaseapp.com",
  "messagingSenderId": "932976563602"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
