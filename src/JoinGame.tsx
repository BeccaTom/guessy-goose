import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, query, where, getDocs, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "./firebase-config";
import { auth } from "./firebase-config";

const JoinGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [gameCode, setGameCode] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleJoinGame = async () => {
    if (!gameCode) {
      setError("Please enter a game code.");
      return;
    }

    try {
      const q = query(collection(db, "games"), where("gameCode", "==", gameCode));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const gameDoc = querySnapshot.docs[0]; // Assuming game codes are unique and using the first match
        const gameRef = gameDoc.ref;

        const gameData = gameDoc.data();

        // Add current player to the game
        const user = auth.currentUser;
        if (user) {
          const playerData = {
            uid: user.uid,
            username: user.displayName || "Anonymous",
            profilePic: user.photoURL || "",
          };

          await updateDoc(gameRef, {
            playersJoined: arrayUnion(playerData),
          });

          // Navigate to the game waiting room
          navigate(`/game/${gameCode}`);
        }
      } else {
        setError("Game not found. Please check the game code.");
      }
    } catch (err) {
      console.error("Error joining game:", err);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center">
      <h2 className="text-2xl mb-4">Join a Game</h2>
      <input
        type="text"
        value={gameCode}
        onChange={(e) => setGameCode(e.target.value)}
        placeholder="Enter Game Code"
        className="w-full p-2 border rounded-md mb-4"
      />
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <button
        onClick={handleJoinGame}
        className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 mb-4"
      >
        Join Game
      </button>
      <button
        onClick={onBack}
        className="text-blue-500 hover:underline"
      >
        Back
      </button>
    </div>
  );
};

export default JoinGame;
