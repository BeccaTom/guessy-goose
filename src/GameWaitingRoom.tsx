import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, onSnapshot, getDocs, query, collection, where } from "firebase/firestore";
import { db } from "./firebase-config";
import OptionlessModal from "./OptionlessModal";  

interface Player {
  uid: string;
  username: string;
  profilePic: string;
}

const GameWaitingRoom: React.FC = () => {
  const { gameCode } = useParams<{ gameCode: string }>();
  const [players, setPlayers] = useState<Player[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [gameStarting, setGameStarting] = useState<boolean>(false);  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        const q = query(collection(db, "games"), where("gameCode", "==", gameCode));
        const querySnapshot = await getDocs(q);
  
        if (!querySnapshot.empty) {
          const gameDoc = querySnapshot.docs[0];  
          const gameData = gameDoc.data();

          if (gameData) {
            setPlayers(gameData?.playersJoined || []);
          } else {
            setError("Game not found.");
          }
        } else {
          setError("Game not found.");
        }
      } catch (err) {
        console.error("Error fetching game data:", err);
        setError("An error occurred. Please try again.");
      }
    };

    fetchGameData();
  }, [gameCode]);

  useEffect(() => {
    if (gameCode) {
      const q = query(collection(db, "games"), where("gameCode", "==", gameCode));
      
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        if (!querySnapshot.empty) {
          const gameDoc = querySnapshot.docs[0];
          const gameData = gameDoc.data();
          if (gameData?.gameState === "starting") {
            setGameStarting(true); 
            setTimeout(() => {
              navigate(`/game-room/${gameCode}`);
            }, 2000);
          }
        }
      });
  
       return () => unsubscribe();
    }
  }, [gameCode, navigate]);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center">
      <h2 className="text-2xl mb-4">Waiting Room</h2>
      <div className="space-y-4">
        {players.map((player) => (
          <div key={player.uid} className="flex items-center">
            <img
              src={player.profilePic}
              alt={player.username}
              className="w-12 h-12 rounded-full mr-4"
            />
            <span className="font-semibold">{player.username}</span>
          </div>
        ))}
      </div>
      {gameStarting && <OptionlessModal message="The game is starting! Get ready..." />}
    </div>
  );
};

export default GameWaitingRoom;
