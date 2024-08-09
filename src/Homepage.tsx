import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebase-config";
import { signOut } from "firebase/auth";
import LogoutConfirmationModal from "./LogoutConfirmationModal";

const HomePage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log("User signed out");
        navigate("/"); // Redirect to login page after logout
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
    <div>
      <h1>Welcome to the Homepage!</h1>
      <p>You are logged in.</p>
      <button onClick={handleOpenModal}>Logout</button>

      <LogoutConfirmationModal
        open={modalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmLogout}
      />
    </div>
  );
};

export default HomePage;
