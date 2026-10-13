import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCcGwUt5r66LvYjFarnCQansUDuok5bGmM",
  authDomain: "beehivefinal.firebaseapp.com",
  projectId: "beehivefinal",
  storageBucket: "beehivefinal.firebasestorage.app",
  messagingSenderId: "386933249059",
  appId: "1:386933249059:web:745233bb1806dc0e1c8d96",
  measurementId: "G-6TRH122SHH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export default app;
