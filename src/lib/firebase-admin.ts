
import * as admin from 'firebase-admin';

// This file is the single source of truth for the server-side Firebase Admin SDK.
// It ensures that the admin app is initialized only once (singleton pattern).

const serviceAccountString = process.env.FIREBASE_ADMIN_CONFIG;

if (!serviceAccountString) {
  throw new Error('The FIREBASE_ADMIN_CONFIG environment variable is not set. Please follow the instructions in the README to set it up.');
}

const serviceAccount = JSON.parse(serviceAccountString);

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // Add your databaseURL here if you are using Realtime Database
    // databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
  });
}

// Export the initialized admin SDK services
const adminAuth = admin.auth();
const db = admin.firestore();

export { adminAuth, db, admin };
