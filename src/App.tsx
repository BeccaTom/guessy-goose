import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthComponent from './AuthComponent';
import Homepage from './Homepage';
import EmojiBackground from './EmojiBackground';
import CreateGame from "./CreateGame";
import JoinGame from "./JoinGame";
import GameWaitingRoom from "./GameWaitingRoom";
import GameRoom from "./GameRoom";

const App: React.FC = () => {
  return (
    <div className="relative h-screen w-screen">
      <EmojiBackground /> 
      <div className="absolute inset-0">
        <Router>
          <Routes>
          <Route path="/" element={<AuthComponent />} />
          <Route path="/home" element={<Homepage />} />
          <Route path="/create-game" element={<CreateGame onBack={() => {}} />} />
          <Route path="/join-game" element={<JoinGame />} />
          <Route path="/game/:gameCode" element={<GameWaitingRoom />} />
          <Route path="/game-room/:gameCode" element={<GameRoom />} />
          </Routes>
        </Router>
      </div>
    </div>
  );
};

export default App;
