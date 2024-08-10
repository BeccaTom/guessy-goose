import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase-config";

interface Player {
  uid: string;
  username: string;
  profilePic: string;
}

const GameWaitingRoom: React.FC = () => {
  const { gameCode } = useParams<{ gameCode: string }>();
  const [players, setPlayers] = useState<Player[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        const gameRef = doc(db, "games", gameCode);
        const gameDoc = await getDoc(gameRef);

        if (gameDoc.exists()) {
          const gameData = gameDoc.data();
          setPlayers(gameData?.playersJoined || []);
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
    </div>
  );
};

export default GameWaitingRoom;
