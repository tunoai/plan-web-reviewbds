// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyALqMzccHCBK2F7_t-2XPdtuyh1V_fyJNo",
  authDomain: "plan-mkt-webbds.firebaseapp.com",
  projectId: "plan-mkt-webbds",
  storageBucket: "plan-mkt-webbds.firebasestorage.app",
  messagingSenderId: "230225291611",
  appId: "1:230225291611:web:7e344c58d0681a12bb127e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

export default app;
