import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db, auth } from './firebase-config'; 
import { collection, query, where, getDocs, updateDoc, onSnapshot } from 'firebase/firestore';
import './GameRoom.css';
import CardViewerModal from './CardViewerModal';

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
  const [showcasedCard, setShowcasedCard] = useState<string | null>(null);
  const [selectionMessage, setSelectionMessage] = useState<string | null>(null);
  const [wordMessage, setWordMessage] = useState<string | null>(null);
  const [displayHint, setDisplayHint] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);

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
          }
        }

        setPlayerHands(gameData?.playerHands || {});
        setCurrentTurn(gameData.currentTurn || null);
        setShowcasedCard(gameData?.showcasedCard || null);
        setSelectionMessage(gameData?.selectionMessage || null);
        setWordMessage(gameData?.wordMessage || null);
        setDisplayHint(gameData?.displayHint || false);
      }
    });

    return () => unsubscribe(); // Cleanup on component unmount
  }, [gameCode]);

  useEffect(() => {
    if (currentTurn) {
      const player = players.find(p => p.uid === currentTurn);
      if (player) {
        setTurnMessage(`It's ${player.username}'s turn 🤓`);
      }
    }
  }, [currentTurn, players]);

  const handleSelectClick = (index: number) => {
    setSelectedCardIndex(index);
    setHintModalOpen(true);
  };

  const handleHintSubmit = async () => {
    if (selectedCardIndex !== null && currentUser) {
        const selectedCardUrl = playerHands[currentUser.uid][selectedCardIndex];
        
        setHintModalOpen(false);
        setHintText('');
        setSelectionMessage(`${currentUser.username} has selected their card!`);

        const q = query(collection(db, "games"), where("gameCode", "==", gameCode));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const gameDoc = querySnapshot.docs[0];
            const gameRef = gameDoc.ref;
            
            await updateDoc(gameRef, {
                showcasedCard: selectedCardUrl,
                selectionMessage: `${currentUser.username} has selected their card!`,
            });

            setTimeout(async () => {
                await updateDoc(gameRef, {
                    selectionMessage: null,
                    wordMessage: "The word is...",
                });

                setTimeout(async () => {
                    await updateDoc(gameRef, {
                        wordMessage: null,
                        displayHint: true,
                    });
                }, 3000);

            }, 3000);
        }
    }
};


  const handleHintModalClose = () => {
    setHintModalOpen(false);
    setHintText('');
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
      {selectionMessage && <div className="selection-message">{selectionMessage}</div>}
      {showcasedCard && (
        <div className="showcased-card-container">
          <div className="flipped-card">
            <img src="./assets/guessy-goose.png" alt="Guessy Goose" className="guessygoose-image" />
          </div>
        </div>
      )}
      {wordMessage && <div className="word-message">{wordMessage}</div>}
      {displayHint && <div className="hint-text">{hintText}</div>}

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
        
      {currentUser && (
        <div className="current-player">
          <div className="select-buttons">
            {playerHands[currentUser.uid]?.length > 0 && currentTurn === currentUser.uid && (
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
          <div className="cards">
            {playerHands[currentUser.uid]?.length > 0 ? (
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
      )}

      <CardViewerModal
        isOpen={modalOpen}
        cards={playerHands[currentUser?.uid || ''] || []}
        currentIndex={currentCardIndex}
        onClose={handleCloseModal}
        onPrev={handlePrevCard}
        onNext={handleNextCard}
      />

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
            <button onClick={handleHintSubmit} className="submit-hint-btn">Submit</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameRoom;
