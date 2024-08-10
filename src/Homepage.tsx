import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebase-config";
import { signOut } from "firebase/auth";
import LogoutConfirmationModal from "./LogoutConfirmationModal";
import CreateGame from "./CreateGame";
import JoinGame from "./JoinGame";  // Import the JoinGame component
import guessyGooseImage from './assets/guessy-goose.png';
import './HomePage.css';

const HomePage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [showCreateGame, setShowCreateGame] = useState(false);
  const [showJoinGame, setShowJoinGame] = useState(false); // New state for JoinGame
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log("User signed out");
        navigate("/"); 
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleConfirmLogout = () => {
    setModalOpen(false);
    handleLogout();
  };

  return (
    <div className="relative flex flex-col items-center justify-center h-screen w-screen">
      <button
        onClick={handleOpenModal}
        className="absolute top-5 right-5 bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500"
      >
        Logout
      </button>

      <div className="text-center">
        <img src={guessyGooseImage} alt="Guessy Goose" className="mb-4 w-32 h-auto mx-auto" />
        <h1 className="text-7xl font-extrabold mb-6 text-customDarkGray tracking-tight text-shadow-sm">
          Guessy Goose
        </h1>
        {showCreateGame ? (
          <CreateGame onBack={() => setShowCreateGame(false)} />
        ) : showJoinGame ? (  // Conditionally render JoinGame component
          <JoinGame />
        ) : (
          <div className="flex space-x-4 justify-center">
            <button
              className="bg-white text-customDarkGray text-xl px-8 py-4 w-60 rounded-2xl border border-gray-200 hover:bg-gray-100 transition"
              onClick={() => setShowCreateGame(true)}
            >
              Start New Game
            </button>
            <button
              className="bg-white text-customDarkGray text-xl px-8 py-4 w-60 rounded-2xl border border-gray-200 hover:bg-gray-100 transition"
              onClick={() => setShowJoinGame(true)}  // Set the state to show the JoinGame component
            >
              Join Game
            </button>
          </div>
        )}
      </div>

      <LogoutConfirmationModal
        open={modalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmLogout}
      />
    </div>
  );
};

export default HomePage;
