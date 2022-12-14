// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: "nextjs-netflix-f7a4c.firebaseapp.com",
  projectId: "nextjs-netflix-f7a4c",
  storageBucket: "nextjs-netflix-f7a4c.appspot.com",
  messagingSenderId: "282550962847",
  appId: "1:282550962847:web:0d5fc7a49e4ceeb8a6b0aa"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const auth = getAuth();

export default app;
export { auth, db };
