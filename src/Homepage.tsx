import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebase-config";
import { signOut } from "firebase/auth";
import ConfirmationModal from "./ConfirmationModal"; // Import the generalized modal
import CreateGame from "./CreateGame";
import JoinGame from "./JoinGame"; 
import guessyGooseImage from './assets/guessy-goose.png';
import './HomePage.css';

const HomePage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState<string>("Log Out");
  const [modalMessage, setModalMessage] = useState<string>("Are you sure you want to log out?");
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});
  const [showCreateGame, setShowCreateGame] = useState(false);
  const [showJoinGame, setShowJoinGame] = useState(false); 
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

  const handleConfirmLogout = () => {
    setModalOpen(false);
    handleLogout();
  };

  const handleOpenLogoutModal = () => {
    setModalTitle("Log Out");
    setModalMessage("Are you sure you want to log out?");
    setConfirmAction(() => handleConfirmLogout);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <div className="relative flex flex-col items-center justify-center h-screen w-screen">
      <div className="text-center">
        <img src={guessyGooseImage} alt="Guessy Goose" className="mb-4 w-32 h-auto mx-auto" />
        <h1 className="text-7xl font-extrabold mb-6 text-customDarkGray tracking-tight text-shadow-sm">
          Guessy Goose
        </h1>
        {showCreateGame ? (
          <CreateGame onBack={() => setShowCreateGame(false)} />
        ) : showJoinGame ? ( 
            <JoinGame onBack={() => setShowJoinGame(false)} />
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
              onClick={() => setShowJoinGame(true)}  
            >
              Join Game
            </button>
          </div>
        )}
      </div>

      <ConfirmationModal
        open={modalOpen}
        onClose={handleCloseModal}
        onConfirm={confirmAction}
        title={modalTitle}
        message={modalMessage}
        confirmButtonText="Confirm"
        cancelButtonText="Cancel"
      />
    </div>
  );
};

export default HomePage;
