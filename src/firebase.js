import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC-HQNlA0aXHVi6mtc3umgBWilLEY5TRa0",
  authDomain: "esportrestream.firebaseapp.com",
  databaseURL:"https://esportrestream-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "esportrestream",
  storageBucket: "esportrestream.firebasestorage.app",
  messagingSenderId: "222041071995",
  appId: "1:222041071995:web:cbb97b554817e0acc55dde",
  measurementId: "G-2NKHCT6FR4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Database and Auth for our Chat System
export const db = getDatabase(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();