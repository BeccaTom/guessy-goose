import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from './firebase-config';
import { signOut } from 'firebase/auth';
import ConfirmationModal from './ConfirmationModal';
import './Navbar.css';

const Navbar: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log("User signed out");
        navigate("/"); // Navigate to the login page after logout
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
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        {user && (
          <>
            <img 
              src={user.photoURL || 'https://example.com/default-profile-pic.jpg'} 
              alt={user.displayName || 'User'} 
              className="navbar-profile-pic"
            />
            <span>{user.displayName}</span>
          </>
        )}
      </div>
      <div className="navbar-right">
        {user && (
          <>
            <button 
              onClick={handleOpenLogoutModal} 
              className="navbar-logout-button"
            >
              Logout
            </button>
          </>
        )}
      </div>
      <ConfirmationModal
        open={modalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmLogout}
        title="Log Out"
        message="Are you sure you want to log out?"
        confirmButtonText="Confirm"
        cancelButtonText="Cancel"
      />
    </nav>
  );
};

export default Navbar;
