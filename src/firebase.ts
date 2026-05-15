// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDi6CAjI0cHqtSIvYCB2H437orSoEgr2fE",
  authDomain: "mkt-aireviewbds-02.firebaseapp.com",
  projectId: "mkt-aireviewbds-02",
  storageBucket: "mkt-aireviewbds-02.firebasestorage.app",
  messagingSenderId: "183870887984",
  appId: "1:183870887984:web:a63e1a3f949dcc394235f5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

export default app;
