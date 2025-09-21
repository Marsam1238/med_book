// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

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
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
