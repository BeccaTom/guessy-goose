// OptionlessModal.tsx
import React from "react";

interface OptionlessModalProps {
  message: string;
}

const OptionlessModal: React.FC<OptionlessModalProps> = ({ message }) => {
  return (
    <div style={modalStyles.overlay}>
      <div style={modalStyles.modal}>
        <h2>{message}</h2>
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
};

export default OptionlessModal;
