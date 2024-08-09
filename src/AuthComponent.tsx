import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebase-config";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import "./AuthComponent.css"; // Import the CSS file for styling

const AuthComponent: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: "165386908212-b2s2jmcr9lb2u0tcmiqp716ub5f7qtec.apps.googleusercontent.com",
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

  const handleAuthAction = () => {
    if (isLogin) {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          console.log("Logged in:", userCredential.user);
          navigate("/home");
        })
        .catch((error) => {
          console.error("Error logging in:", error);
        });
    } else {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          console.log("Account created:", userCredential.user);
          navigate("/home");
        })
        .catch((error) => {
          console.error("Error creating account:", error);
        });
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
        <h2>{isLogin ? "Login" : "Sign Up"}</h2>
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
