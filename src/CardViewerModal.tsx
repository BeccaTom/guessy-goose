import React from 'react';

interface CardViewerModalProps {
  isOpen: boolean;
  cards: string[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

const CardViewerModal: React.FC<CardViewerModalProps> = ({ isOpen, cards, currentIndex, onClose, onPrev, onNext }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <img src={cards[currentIndex]} alt={`Card ${currentIndex + 1}`} />
        <div className="carousel-controls">
          <button onClick={onPrev} className="carousel-button">Previous</button>
          <button onClick={onNext} className="carousel-button">Next</button>
        </div>
      </div>
    </div>
  );
};

export default CardViewerModal;
