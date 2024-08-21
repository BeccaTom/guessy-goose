import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebase-config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  updateProfile
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore"; 
import { generateProfilePic } from "./Utils";  
import guessyGooseImage from './assets/guessy-goose.png';
import { db } from "./firebase-config";
import "./AuthComponent.css";

const AuthComponent: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");  
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [error, setError] = useState<string>(""); 
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
         navigate("/home");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleAuthAction = async () => {
    setError("");  
    if (isLogin) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("Logged in:", userCredential.user);
        navigate("/home");
      } catch (error: any) {
        handleAuthError(error);
      }
    } else {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        if (user) {
          const profilePicUrl = generateProfilePic(username);

          await updateProfile(user, {
            displayName: username,
            photoURL: profilePicUrl
          });

          await setDoc(doc(db, "users", user.uid), {
            username: username,
            email: user.email,
            profilePic: profilePicUrl
          });
        }

        console.log("Account created:", user);
        navigate("/home");
      } catch (error: any) {
        handleAuthError(error);
      }
    }
  };

  const handleAuthError = (error: any) => {
    switch (error.code) {
      case 'auth/user-not-found':
        setError("No user found with this email.");
        break;
      case 'auth/wrong-password':
        setError("Incorrect password.");
        break;
      case 'auth/too-many-requests':
        setError("Too many unsuccessful login attempts. Please try again later.");
        break;
      default:
        setError("An error occurred during login. Please try again.");
    }
  };

  const handleGoogleSignIn = async (response: any) => {
    try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      console.log("Google Sign-In successful:", result.user);
      navigate("/home");
    } catch (error: any) {
      setError("An error occurred with Google Sign-In. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <img src={guessyGooseImage} alt="Guessy Goose" className="mb-4 w-24 h-auto mx-auto" />
        <h1 className="text-5xl font-extrabold mb-6 text-customDarkGray tracking-tight">Guessy Goose</h1>

        <h2 className="text-xl font-extrabold">{isLogin ? "Login" : "Sign Up"}</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>} 
        {!isLogin && (
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="w-full p-2 mb-4 border rounded-md"
          />
        )}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full p-2 mb-4 border rounded-md"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full p-2 mb-4 border rounded-md"
        />
        <button onClick={handleAuthAction} className="auth-button w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-700">
          {isLogin ? "Login" : "Sign Up"}
        </button>
        <div id="google-sign-in" className="google-button mt-4"></div>
        <button onClick={() => setIsLogin(!isLogin)} className="toggle-button text-blue-500 hover:underline mt-4">
          {isLogin ? "Create an account" : "Already have an account? Log in"}
        </button>
      </div>
    </div>
  );
};

export default AuthComponent;
