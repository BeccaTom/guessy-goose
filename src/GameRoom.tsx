import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db, auth } from './firebase-config'; 
import { collection, query, where, getDocs } from 'firebase/firestore';
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
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);

  useEffect(() => {
    const fetchGameAndPlayers = async () => {
      if (!gameCode) return;

      const q = query(collection(db, "games"), where("gameCode", "==", gameCode));
      const querySnapshot = await getDocs(q);

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
      }
    };

    fetchGameAndPlayers();
  }, [gameCode]);

  const handleCardClick = (index: number) => {
    setCurrentCardIndex(index);
    setModalOpen(true);
  };

  const handlePrevCard = () => {
    setCurrentCardIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : playerHands[currentUser?.uid || ''].length - 1));
  };

  const handleNextCard = () => {
    setCurrentCardIndex((prevIndex) => (prevIndex < playerHands[currentUser?.uid || ''].length - 1 ? prevIndex + 1 : 0));
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <div className="game-room">
      {/* Display all players around the edge */}
      <div className="players">
        {players.map((player, index) => (
          <div key={`${player.uid}-${index}`} className={`player player-${index}`}>
            <img src={player.profilePic} alt={player.username} className="player-profile-pic" />
            <span>{player.username}</span>
          </div>
        ))}
      </div>

      {currentUser && (
        <div className="current-player">
          <h2>Your Cards</h2>
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
    </div>
  );
};

export default GameRoom;
