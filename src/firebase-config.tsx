import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth"; // Import GoogleAuthProvider
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAWmzjeFHW4Bz0OTPhaf4ZDhTJ7R8_TNsk",
  authDomain: "ai-image-game-ed54c.firebaseapp.com",
  projectId: "ai-image-game-ed54c",
  storageBucket: "ai-image-game-ed54c.appspot.com",
  messagingSenderId: "165386908212",
  appId: "1:165386908212:web:177d5c2bfce4ca2e2dd061",
  measurementId: "G-NDZM586101"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider(); // Initialize Google Provider

export { auth, googleProvider };
