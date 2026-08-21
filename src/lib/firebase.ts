// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";


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
// Note: Firebase Storage is no longer used for image uploads — images now
// go through Cloudinary (see src/lib/cloudinary.ts), since Firebase Storage
// requires the paid Blaze plan even at minimal usage as of Feb 2026.

// App Check (bot/abuse protection) — only runs in the browser, and only if
// a reCAPTCHA site key is configured. Safe to skip silently if not set yet
// (e.g. during initial setup), so this never breaks the build or local dev.
// See docs/app-check-setup.md for the one-time setup steps.
if (typeof window !== 'undefined') {
  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  if (recaptchaSiteKey) {
    // To test locally without a real reCAPTCHA challenge, uncomment the next
    // line, run the app, copy the debug token logged to the browser console,
    // and add it in Firebase Console -> App Check -> Apps -> this app -> Manage debug tokens.
    // (window as any).FIREBASE_APPCHECK_DEBUG_TOKEN = true;

    initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(recaptchaSiteKey),
      isTokenAutoRefreshEnabled: true,
    });
  }
}


export { app, db, auth };