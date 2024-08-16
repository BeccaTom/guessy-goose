import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from './firebase-config';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import './GameRoom.css';

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

  useEffect(() => {
    const fetchGameAndPlayers = async () => {
      const q = query(collection(db, "games"), where("gameCode", "==", gameCode));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const gameDoc = querySnapshot.docs[0];
        const gameData = gameDoc.data();

        // Set players
        setPlayers(gameData?.playersJoined || []);

        // Assuming you have a real auth system in place to get the UID
        const currentUserUID = "0HBYEu2NSkY3PmZstM8lfLQPp2L2"; // Example UID
        const user = {
          uid: currentUserUID,
          username: "Current User",
          profilePic: "currentUserProfilePic",
        };
        setCurrentUser(user);

        // Set player hands
        setPlayerHands(gameData?.playerHands || {});
      }
    };

    fetchGameAndPlayers();
  }, [gameCode]);

  useEffect(() => {
    if (currentUser) {
      console.log("Current User UID:", currentUser.uid);
      console.log("Player Hands:", playerHands);
    }
  }, [currentUser, playerHands]);

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
                <img key={`${currentUser.uid}-${index}`} src={url} alt={`Card ${index + 1}`} className="player-card" />
              ))
            ) : (
              <p>No cards to display</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GameRoom;
