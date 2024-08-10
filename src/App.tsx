import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthComponent from './AuthComponent';
import Homepage from './Homepage';
import EmojiBackground from './EmojiBackground';

const App: React.FC = () => {
  return (
    <div className="relative h-screen w-screen">
      <EmojiBackground /> 
      <div className="absolute inset-0">
        <Router>
          <Routes>
            <Route path="/" element={<AuthComponent />} />
            <Route path="/home" element={<Homepage />} />
          </Routes>
        </Router>
      </div>
    </div>
  );
};

export default App;
