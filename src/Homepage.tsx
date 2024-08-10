import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebase-config";
import { signOut } from "firebase/auth";
import LogoutConfirmationModal from "./LogoutConfirmationModal";
import guessyGooseImage from './assets/guessy-goose.png'; 

const HomePage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
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
    <div className="relative flex flex-col items-center justify-center h-screen w-screen bg-gray-200">
      <button
        onClick={handleOpenModal}
        className="absolute top-5 right-5 bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500"
      >
        Logout
      </button>
      <div className="text-center">
        <img src={guessyGooseImage} alt="Guessy Goose" className="mb-4 w-64 h-auto" />
        <h1 className="text-7xl font-bold mb-6 text-white text-shadow-customTurquoise">
          Guessy Goose
        </h1>
        <div className="flex space-x-4 justify-center">
          <button className="bg-customTurquoise text-white text-xl px-6 py-4 rounded-md hover:bg-customDarkTurquoise w-52">
            START NEW GAME
          </button>
          <button className="bg-customOrange text-white text-xl px-6 py-4 rounded-md hover:bg-customDarkOrange w-52">
            JOIN GAME
          </button>
        </div>
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
