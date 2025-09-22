// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  "projectId": "studio-9515012891-53352",
  "appId": "1:570054085392:web:6c5124c2e13527c1a0f395",
  "apiKey": "AIzaSyAKvyz-1cSWoHtoJRglzOEJ9SijTz5PwRM",
  "authDomain": "studio-9515012891-53352.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "570054085392"
};


// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
}

const db = getFirestore(app);

// Enable offline persistence
try {
  enableIndexedDbPersistence(db);
} catch (err: any) {
  if (err.code == 'failed-precondition') {
    // Multiple tabs open, persistence can only be enabled in one.
    // Silently fail.
  } else if (err.code == 'unimplemented') {
    // The current browser does not support all of the
    // features required to enable persistence
  }
}


export { db };
