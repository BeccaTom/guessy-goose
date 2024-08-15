// firebase-config.js

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAWmzjeFHW4Bz0OTPhaf4ZDhTJ7R8_TNsk",
  authDomain: "ai-image-game-ed54c.firebaseapp.com",
  projectId: "ai-image-game-ed54c",
  storageBucket: "ai-image-game-ed54c.appspot.com",
  messagingSenderId: "165386908212",
  appId: "1:165386908212:web:177d5c2bfce4ca2e2dd061",
  measurementId: "G-NDZM586101"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, googleProvider, db, storage };
