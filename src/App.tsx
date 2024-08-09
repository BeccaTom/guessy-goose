import './App.css'
import Homepage from "./Homepage";
import AuthComponent from './AuthComponent.tsx'; 
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

function App() {
  return (
    <>
     <Router>
      <Routes>
        <Route path="/" element={<AuthComponent />} />
        <Route path="/home" element={<Homepage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
    </>
  )
}

export default App
