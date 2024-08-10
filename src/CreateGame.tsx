import React, { useState } from "react";

const CreateGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [maxPlayers, setMaxPlayers] = useState<number>(4);
  const [allowStrangers, setAllowStrangers] = useState<boolean>(false);
  const [gameCode, setGameCode] = useState<string | null>(null);

  const generateGameCode = () => {
    return Math.random().toString(36).substr(2, 6).toUpperCase();
  };

  const handleSubmit = () => {
    const code = generateGameCode();
    setGameCode(code);
  };

  const handleCopyGameCode = () => {
    if (gameCode) {
      navigator.clipboard.writeText(gameCode);
      alert("Game code copied to clipboard!");
    }
  };

  const handleStartGame = () => {
    // Handle starting the game here
    console.log("Game started with code:", gameCode);
  };

  const handleSeeMyGames = () => {
    // Handle redirecting to user's games
    console.log("Redirecting to user's games...");
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center">
      {gameCode ? (
        <div>
          <h2 className="text-2xl mb-4">Game Created!</h2>
          <p className="text-lg mb-4">Share this game code with your friends:</p>
          <div
            className="bg-gray-100 p-3 rounded-lg cursor-pointer hover:bg-gray-200"
            onClick={handleCopyGameCode}
          >
            {gameCode}
          </div>
          <div className="mt-6">
            <button
              className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 mb-4"
              onClick={handleStartGame}
            >
              Start Game
            </button>
            <button
              className="w-full p-2 bg-gray-500 text-white rounded-md hover:bg-gray-700"
              onClick={handleSeeMyGames}
            >
              See My Games
            </button>
          </div>
          <button
            onClick={() => setGameCode(null)} // Go back to the create form
            className="text-blue-500 hover:underline mt-4"
          >
            Back To Create Game
          </button>
        </div>
      ) : (
        <div>
          <h2 className="text-2xl mb-4">Create a New Game</h2>
          <div className="mb-4">
            <label className="block text-left mb-2">Max Players:</label>
            <input
              type="number"
              value={maxPlayers}
              onChange={(e) => setMaxPlayers(Number(e.target.value))}
              className="w-full p-2 border rounded-md"
              min={2}
              max={10}
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
