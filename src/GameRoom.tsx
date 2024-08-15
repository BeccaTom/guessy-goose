import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from './firebase-config';
import { doc, onSnapshot, collection, query, where, getDocs } from 'firebase/firestore';
import './GameRoom.css';
import './Utils.ts';

interface Player {
  uid: string;
  username: string;
  profilePic: string;
}

const GameRoom: React.FC = () => {
  const { gameCode } = useParams<{ gameCode: string }>();
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentUser, setCurrentUser] = useState<Player | null>(null); 

  useEffect(() => {
    const fetchPlayers = async () => {
      const q = query(collection(db, "games"), where("gameCode", "==", gameCode));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const gameDoc = querySnapshot.docs[0];
        const gameData = gameDoc.data();
        setPlayers(gameData?.playersJoined || []);

   
        const user = {
          uid: "currentUserUID", // Replace with actual UID from auth
          username: "Current User", // Replace with actual username from auth
          profilePic: "currentUserProfilePic", // Replace with actual profile pic from auth
        };
        setCurrentUser(user);
      }
    };

    fetchPlayers();
  }, [gameCode]);

  return (
    <div className="game-room">
      <div className="players">
        {players.map((player, index) => (
          <div key={player.uid} className={`player player-${index}`}>
            <img src={player.profilePic} alt={player.username} className="player-profile-pic" />
            <span>{player.username}</span>
          </div>
        ))}
      </div>
      {currentUser && (
        <div className="current-player">
          <h2>Your Cards</h2>
          {/* Placeholder for player's cards */}
          <div className="cards">
            {/* Add logic to display player's cards */}
          </div>
        </div>
      )}
    </div>
  );
};

export default GameRoom;