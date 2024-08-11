import React from 'react';
import { useParams } from 'react-router-dom';

const GameRoom: React.FC = () => {
  const { gameCode } = useParams<{ gameCode: string }>();

  return (
    <div className="game-room">
      <h1>Game Room</h1>
      <p>Welcome to the game room for game code: {gameCode}</p>
      {/* Implement game logic here */}
    </div>
  );
};

export default GameRoom;
