import React, { useState, useEffect } from "react";
import { createGame } from "./gameService";
import { auth, db } from "./firebase-config";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "./ConfirmationModal";
import OptionlessModal from "./OptionlessModal";
import { doc, onSnapshot, updateDoc, getDocs, where, collection, query } from "firebase/firestore";

const CreateGame: React.FC = () => {
  const [maxPlayers, setMaxPlayers] = useState<number>(4);
  const [allowStrangers, setAllowStrangers] = useState<boolean>(false);
  const [gameCode, setGameCode] = useState<string | null>(null);
  const [players, setPlayers] = useState<any[]>([]);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [copiedMessage, setCopiedMessage] = useState<string>("");
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [gameStarting, setGameStarting] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (gameCode) {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userObject = {
          uid: currentUser.uid,
          username: currentUser.displayName || "Anonymous",
          profilePic: currentUser.photoURL || "https://example.com/default-profile-pic.jpg",
        };
        setPlayers([userObject]);
      }
    }
  }, [gameCode]);

  useEffect(() => {
    if (gameCode) {
      const q = query(collection(db, "games"), where("gameCode", "==", gameCode));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        if (!querySnapshot.empty) {
          const gameDoc = querySnapshot.docs[0];
          const gameData = gameDoc.data();
          if (gameData?.gameState === "starting") {
            setGameStarting(true); // Trigger the "Starting Game" alert
            setTimeout(() => {
              navigate(`/game-room/${gameCode}`);
            }, 2000); // Navigate to the game room after 2 seconds
          }
        }
      });
      return () => unsubscribe();
    }
  }, [gameCode, navigate]);

  const handleSubmit = async () => {
    try {
      const code = await createGame(maxPlayers, allowStrangers);
      setGameCode(code);
    } catch (error) {
      console.error("Error creating game:", error);
    }
  };

  const handleCopyGameCode = () => {
    if (gameCode) {
      navigator.clipboard.writeText(gameCode);
      setIsCopied(true);
      setCopiedMessage("Copied!");
      setTimeout(() => {
        setIsCopied(false);
        setCopiedMessage(gameCode || "");
      }, 1500);
    }
  };

  const handleStartGame = async (code: string) => {
    try {
      const q = query(collection(db, "games"), where("gameCode", "==", code));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const gameDoc = querySnapshot.docs[0];
        const gameRef = gameDoc.ref;
        await updateDoc(gameRef, { gameState: "starting" });
        console.log("Game started with code:", code);

        // Trigger the starting game modal immediately
        setGameStarting(true);
        setTimeout(() => {
          navigate(`/game-room/${gameCode}`);
        }, 2000); // Navigate after 2 seconds
      }
    } catch (error) {
      console.error("Error starting the game:", error);
    }
  };

  const handleBackButton = () => {
    if (gameCode) {
      setModalOpen(true);
    } else {
      navigate("/home");
    }
  };

  const confirmBack = async () => {
    if (gameCode) {
      try {
        const q = query(collection(db, "games"), where("gameCode", "==", gameCode));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const gameDoc = querySnapshot.docs[0];
          const gameRef = gameDoc.ref;
          await updateDoc(gameRef, { gameState: "abandoned" });
          console.log("Game marked as abandoned by navigating back.");
        }

        setModalOpen(false);
        setGameCode(null);
        navigate("/home");
      } catch (error) {
        console.error("Failed to mark game as abandoned:", error);
      }
    } else {
      setModalOpen(false);
      navigate("/home");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center">
      {gameCode ? (
        <div>
          <h2 className="text-2xl mb-4">Game Created!</h2>
          <p className="text-lg mb-4">Share this game code with your friends:</p>
          <div
            className={`p-3 rounded-lg cursor-pointer ${isCopied ? 'bg-green-200' : 'bg-gray-100 hover:bg-gray-200'}`}
            onClick={handleCopyGameCode}
          >
            {copiedMessage || gameCode}
          </div>

          <div className="mt-6">
            <h3 className="text-xl mb-4">Players Joined</h3>
            <ul className="list-none p-0">
              {players.map((player) => (
                <li key={player.uid} className="flex items-center mb-2">
                  <img src={player.profilePic} alt={player.username} className="w-10 h-10 rounded-full mr-4" />
                  <span className="text-lg">{player.username}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6">
            <button
              className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 mb-4"
              onClick={() => handleStartGame(gameCode)}
            >
              Start Game
            </button>
          </div>
          <button
            onClick={handleBackButton}
            className="text-blue-500 hover:underline mt-4"
          >
            Back
          </button>
        </div>
      ) : (
        <div>
          <h2 className="text-2xl mb-4">Create a New Game</h2>
          <div className="mb-4">
            <label className="block text-left mb-2">Max Players (2-12):</label>
            <input
              type="number"
              value={maxPlayers}
              onChange={(e) => setMaxPlayers(Math.min(Math.max(2, Number(e.target.value)), 12))}
              className="w-full p-2 border rounded-md"
              min={2}
              max={12}
            />
          </div>
          <div className="mb-4 text-left">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={allowStrangers}
                onChange={(e) => setAllowStrangers(e.target.checked)}
                className="form-checkbox"
              />
              <span className="ml-2">Allow strangers to join?</span>
            </label>
          </div>
          <button
            onClick={handleSubmit}
            className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
          >
            Create Game
          </button>
          <button
            onClick={handleBackButton}
            className="text-blue-500 hover:underline mt-4"
          >
            Back
          </button>
        </div>
      )}

      <ConfirmationModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={confirmBack}
        title="Delete Game"
        message="Are you sure you want to go back? This will delete the current game."
        confirmButtonText="Delete Game"
        cancelButtonText="Cancel"
      />
      
      {gameStarting && <OptionlessModal message="The game is starting! Get ready..." />}
    </div>
  );
};

export default CreateGame;
