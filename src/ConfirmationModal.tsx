import React from "react";

interface ConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmButtonText?: string;  // Optional, to customize the confirm button text
  cancelButtonText?: string;   // Optional, to customize the cancel button text
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmButtonText = "Confirm",
  cancelButtonText = "Cancel",
}) => {
  if (!open) return null;

  return (
    <div style={modalStyles.overlay}>
      <div style={modalStyles.modal}>
        <h2>{title}</h2>
        <p>{message}</p>
        <div style={modalStyles.actions}>
          <button onClick={onClose} style={modalStyles.cancelButton}>
            {cancelButtonText}
          </button>
          <button onClick={onConfirm} style={modalStyles.confirmButton}>
            {confirmButtonText}
          </button>
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
    fontColor: "#383838",
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
  confirmButton: {
    padding: "10px 20px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    background: "#007BFF",
    color: "#fff",
  },
  cancelButton: {
    padding: "10px 20px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    background: "#6c757d",
    color: "#fff",
  },
};

export default ConfirmationModal;
