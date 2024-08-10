import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebase-config";
import { signOut } from "firebase/auth";
import LogoutConfirmationModal from "./LogoutConfirmationModal";
import guessyGooseImage from './assets/guessy-goose.png';
import './HomePage.css';

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

  useEffect(() => {
    const emojis = ['❔', '🥸', '🤨', '🖼️', '🦜', '🕺', '🎨', '🪿', '🦄', '🫶', '🪼', '🦋', '🦞', '🍄', '💫', '🫧', '🐸', '🍻'];
    const emojiContainer = document.getElementById('emoji-rain-container');

    const createEmoji = () => {
      const emojiElement = document.createElement('span');
      const emoji = emojis[Math.floor(Math.random() * emojis.length)];
      emojiElement.textContent = emoji;
      emojiElement.classList.add('falling-emoji');

      // Larger size range for more variation
      const size = Math.random() * 8 + 2 + 'rem'; // Size range from 2rem to 10rem
      emojiElement.style.fontSize = size;

      // Random horizontal position
      emojiElement.style.left = Math.random() * 100 + 'vw';

      // Slower fall speed
      const duration = Math.random() * 8 + 12 + 's'; // Slower fall speed between 12s and 20s
      emojiElement.style.animationDuration = duration;

      // Add the emoji to the container
      emojiContainer.appendChild(emojiElement);

      // Remove the emoji after the animation is done to prevent memory leaks
      emojiElement.addEventListener('animationend', () => {
        emojiElement.remove();
      });
    };

    // Create a new emoji at random intervals
    const interval = setInterval(createEmoji, 300);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center h-screen w-screen">
      <div id="emoji-rain-container" className="bg-gray-200 opacity-40"></div> {/* Container for emoji rain */}

      <button
        onClick={handleOpenModal}
        className="absolute top-5 right-5 bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500"
      >
        Logout
      </button>
      <div className="text-center">
        <img src={guessyGooseImage} alt="Guessy Goose" className="mb-4 w-32 h-auto" />
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
