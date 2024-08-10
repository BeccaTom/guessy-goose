import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebase-config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile
} from "firebase/auth";
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
  const [error, setError] = useState<string>(""); // State to store error messages
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
    setError(""); // Clear previous errors
    if (isLogin) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("Logged in:", userCredential.user);
        navigate("/home");
      } catch (error: any) {
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
      } catch (error: any) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            setError("This email is already in use. Please use a different email.");
            break;
          case 'auth/weak-password':
            setError("Password must be at least 6 characters long.");
            break;
          default:
            setError("An error occurred during account creation. Please try again.");
        }
      }
    }
  };

  const handleGoogleSignIn = async (response: any) => {
    try {
      const credential = GoogleAuthProvider.credential(response.credential);
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
        {error && <div className="text-red-500 mb-4">{error}</div>} {/* Display error message */}
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
