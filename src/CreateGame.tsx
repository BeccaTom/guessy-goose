import React, { useState, useEffect } from "react";
import { createGame } from "./gameService";  // Import createGame function
import { auth } from "./firebase-config";  // Import Firebase auth

const CreateGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [maxPlayers, setMaxPlayers] = useState<number>(4);
  const [allowStrangers, setAllowStrangers] = useState<boolean>(false);
  const [gameCode, setGameCode] = useState<string | null>(null);
  const [players, setPlayers] = useState<any[]>([]);  // Store the list of players
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [copiedMessage, setCopiedMessage] = useState<string>("");

  useEffect(() => {
    if (gameCode) {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userObject = {
          uid: currentUser.uid,
          username: currentUser.displayName || "Anonymous",
          profilePic: currentUser.photoURL || "https://example.com/default-profile-pic.jpg"
        };
        setPlayers([userObject]);  // Add the current user to the list of players
      }
    }
  }, [gameCode]);

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
        setCopiedMessage(gameCode || ""); // Revert to showing the game code
      }, 1500);
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

          {/* Display list of players in the waiting room */}
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

          {/* Additional UI elements */}
          <div className="mt-6">
            <button
              className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 mb-4"
              onClick={() => console.log("Starting game...")}
            >
              Start Game
            </button>
          </div>
          <button
            onClick={() => setGameCode(null)}
            className="text-blue-500 hover:underline mt-4"
          >
            Back to Create Game
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
            onClick={onBack}
            className="text-blue-500 hover:underline mt-4"
          >
            Back
          </button>
        </div>
      )}
    </div>
  );
};

export default CreateGame;
