// AuthComponent.tsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebase-config";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore"; // Import necessary Firestore functions
import { generateProfilePic } from "./Utils";  // Import the profile picture utility function
import guessyGooseImage from './assets/guessy-goose.png'; 
import { db } from "./firebase-config";
import "./AuthComponent.css"; 

const AuthComponent: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");  // Add a state for username
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: "YOUR_GOOGLE_CLIENT_ID",
        callback: handleGoogleSignIn,
      });

      window.google.accounts.id.renderButton(
        document.getElementById("google-sign-in")!,
        {
          theme: "outline",
          size: "large",
        }
      );
    }
  }, []);

  const handleAuthAction = async () => {
    if (isLogin) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("Logged in:", userCredential.user);
        navigate("/home");
      } catch (error) {
        console.error("Error logging in:", error);
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

          // Save user data to Firestore
          await setDoc(doc(db, "users", user.uid), {
            username: username,
            email: user.email,
            profilePic: profilePicUrl
          });
        }

        console.log("Account created:", user);
        navigate("/home");
      } catch (error) {
        console.error("Error creating account:", error);
      }
    }
  };

  const handleGoogleSignIn = async (response: any) => {
    try {
      const credential = GoogleAuthProvider.credential(response.credential);
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      console.log("Google Sign-In successful:", result.user);
      navigate("/home");
    } catch (error) {
      console.error("Error with Google Sign-In:", error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
      <img src={guessyGooseImage} alt="Guessy Goose" className="mb-4 w-24 h-auto mx-auto" />
      <h1 className="text-5xl font-extrabold mb-6 text-customDarkGray tracking-tight">Guessy Goose</h1>

        <h2 className="text-xl font-extrabold">{isLogin ? "Login" : "Sign Up"}</h2>
        {!isLogin && (
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />
        )}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button onClick={handleAuthAction} className="auth-button">
          {isLogin ? "Login" : "Sign Up"}
        </button>
        <div id="google-sign-in" className="google-button"></div>
        <button onClick={() => setIsLogin(!isLogin)} className="toggle-button">
          {isLogin ? "Create an account" : "Already have an account? Log in"}
        </button>
      </div>
    </div>
  );
};

export default AuthComponent;
