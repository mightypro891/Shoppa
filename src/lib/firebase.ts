
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  "projectId": "lautech-shoppa",
  "appId": "1:137647070211:web:53123b35593850386ac236",
  "storageBucket": "lautech-shoppa.appspot.com",
  "apiKey": "AIzaSyAz_-_y9WfALgD8dc7sc-5uoqZhjVbOSdE",
  "authDomain": "lautech-shoppa.firebaseapp.com",
  "messagingSenderId": "137647070211"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
