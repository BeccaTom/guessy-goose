import React from "react";

interface LogoutConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LogoutConfirmationModal: React.FC<LogoutConfirmationModalProps> = ({ open, onClose, onConfirm }) => {
  if (!open) return null;

  return (
    <div style={modalStyles.overlay}>
      <div style={modalStyles.modal}>
        <h2>Log Out</h2>
        <p>Are you sure you want to log out?</p>
        <div style={modalStyles.actions}>
          <button onClick={onClose} style={modalStyles.button}>Cancel</button>
          <button onClick={onConfirm} style={modalStyles.button}>Log Out</button>
        </div>
      </div>
    </div>
  );
};

const modalStyles = {
  overlay: {
    position: "fixed" as "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modal: {
    background: "#fff",
    padding: "20px",
    borderRadius: "8px",
    maxWidth: "400px",
    width: "100%",
    textAlign: "center" as "center",
  },
  actions: {
    marginTop: "20px",
    display: "flex",
    justifyContent: "space-between",
  },
  button: {
    padding: "10px 20px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    background: "#007BFF",
    color: "#fff",
  },
};

export default LogoutConfirmationModal;
