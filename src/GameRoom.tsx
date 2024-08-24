import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db, auth } from './firebase-config'; 
import { collection, query, where, getDocs, updateDoc, onSnapshot } from 'firebase/firestore';
import './GameRoom.css';
import CardViewerModal from './CardViewerModal';
import Toast from './Toast';

interface Player {
  uid: string;
  username: string;
  profilePic: string;
}

const GameRoom: React.FC = () => {
  const { gameCode } = useParams<{ gameCode: string }>();
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentUser, setCurrentUser] = useState<Player | null>(null);
  const [playerHands, setPlayerHands] = useState<{ [key: string]: string[] }>({});
  const [currentTurn, setCurrentTurn] = useState<string | null>(null);
  const [turnMessage, setTurnMessage] = useState<string | null>(null);
  const [hintModalOpen, setHintModalOpen] = useState<boolean>(false);
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);
  const [hintText, setHintText] = useState<string>('');
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hintSubmitted, setHintSubmitted] = useState<boolean>(false);
  const [flippedCardVisible, setFlippedCardVisible] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [currentHintText, setCurrentHintText] = useState<string | null>(null); // New state for keeping hint visible

  useEffect(() => {
    if (!gameCode) return;

    const q = query(collection(db, "games"), where("gameCode", "==", gameCode));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      if (!querySnapshot.empty) {
        const gameDoc = querySnapshot.docs[0];
        const gameData = gameDoc.data();

        setPlayers(gameData?.playersJoined || []);
        
        const currentUserUID = auth.currentUser?.uid;

        if (currentUserUID) {
          const user = gameData.playersJoined.find((player: Player) => player.uid === currentUserUID);
          if (user) {
            setCurrentUser(user);
            setHintSubmitted(gameData?.hintSubmitted || false); 
          }
        }

        setPlayerHands(gameData?.playerHands || {});
        setCurrentTurn(gameData.currentTurn || null);
        setFlippedCardVisible(gameData.flippedCardVisible || false);

        if (gameData.selectionMessage) {
          triggerToastSequence(gameData.selectionMessage, "The word is...", gameData.hintText);
        }
      }
    });

    return () => unsubscribe(); 
  }, [gameCode]);

  useEffect(() => {
    if (currentTurn !== currentUser?.uid) {
      setCurrentHintText(null);  
    }
  }, [currentTurn, currentUser]);

  const triggerToastSequence = (selectionMsg: string, wordMsg: string, hintMsg: string) => {
     
    setToastMessage(selectionMsg);

    
    setTimeout(() => {
      setToastMessage(wordMsg);

       
      setTimeout(() => {
        setToastMessage(null);
        setCurrentHintText(hintMsg);  
      }, 3000);
    }, 3000);
  };

  const handleSelectClick = (index: number) => {
    setSelectedCardIndex(index);
    setHintModalOpen(true);
  };

  const handleHintSubmit = async () => {
    if (!hintText.trim()) {
      setErrorMessage("You must submit a hint."); 
      return;
    }

    if (selectedCardIndex !== null && currentUser) {
      const selectedCardUrl = playerHands[currentUser.uid][selectedCardIndex];
      
      setHintModalOpen(false);
      setErrorMessage(null);

      const q = query(collection(db, "games"), where("gameCode", "==", gameCode));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const gameDoc = querySnapshot.docs[0];
        const gameRef = gameDoc.ref;

        await updateDoc(gameRef, {
          showcasedCard: selectedCardUrl,
          hintText: hintText, 
          flippedCardVisible: true, 
          hintSubmitted: true,
          selectionMessage: `${currentUser.username} has selected their card!`, 
        });

        setHintSubmitted(true); 
      }

      setHintText('');
    }
  };

  const handleHintModalClose = () => {
    setHintModalOpen(false);
    setHintText('');
    setErrorMessage(null);
  };

  const handleCardClick = (index: number) => {
    setCurrentCardIndex(index);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handlePrevCard = () => {
    setCurrentCardIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : playerHands[currentUser?.uid || ''].length - 1));
  };

  const handleNextCard = () => {
    setCurrentCardIndex((prevIndex) => (prevIndex < playerHands[currentUser?.uid || ''].length - 1 ? prevIndex + 1 : 0));
  };

  return (
    <div className="game-room">
      {turnMessage && <div className="turn-message">{turnMessage}</div>}
      <div className="players">
        {players.map((player, index) => (
          <div 
            key={`${player.uid}-${index}`} 
            className={`player player-${index} ${currentTurn === player.uid ? 'current-turn' : ''}`}
          >
            <img src={player.profilePic} alt={player.username} className="player-profile-pic" />
            <span>{player.username}</span>
          </div>
        ))}
      </div>

      {flippedCardVisible && (
        <div className="showcased-card-container">
          <div className="flipped-card">
            <img src="./assets/guessy-goose.png" alt="Guessy Goose" className="guessygoose-image" />
          </div>
        </div>
      )}

      <div className="current-player">
        {!hintSubmitted && (
          <div className="select-buttons">
            {playerHands[currentUser?.uid]?.length > 0 && currentTurn === currentUser?.uid && (
              playerHands[currentUser.uid].map((_, index) => (
                <button 
                  key={`select-${index}`} 
                  className="select-card-btn"
                  onClick={() => handleSelectClick(index)}
                >
                  Select
                </button>
              ))
            )}
          </div>
        )}
        <div className="cards">
          {playerHands[currentUser?.uid]?.length > 0 ? (
            playerHands[currentUser.uid].map((url, index) => (
              <img
                key={`${currentUser.uid}-${index}`}
                src={url}
                alt={`Card ${index + 1}`}
                className="player-card"
                onClick={() => handleCardClick(index)}
              />
            ))
          ) : (
            <p>No cards to display</p>
          )}
        </div>
      </div>

      {currentHintText && (
        <div className="hint-text">
          <strong>Hint:</strong> {currentHintText}
        </div>
      )}

      <CardViewerModal
        isOpen={modalOpen}
        cards={playerHands[currentUser?.uid || ''] || []}
        currentIndex={currentCardIndex}
        onClose={handleCloseModal}
        onPrev={handlePrevCard}
        onNext={handleNextCard}
      />

      {toastMessage && (
        <div className="toast-container">
          <Toast message={toastMessage} />
        </div>
      )}

      {hintModalOpen && (
        <div className="hint-modal-overlay" onClick={handleHintModalClose}>
          <div className="hint-modal-content" onClick={e => e.stopPropagation()}>
            <h3>Give a Hint:</h3>
            <input 
              type="text" 
              placeholder="Type a word or phrase..." 
              value={hintText} 
              onChange={(e) => setHintText(e.target.value)} 
            />
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <button onClick={handleHintSubmit} className="submit-hint-btn">Submit</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameRoom;
