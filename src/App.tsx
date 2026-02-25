import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';
import { PlayerProvider } from './contexts/PlayerContext';
import Login from './components/Login';
import Register from './components/Register';
import Home from './pages/Home';
import Rooms from './pages/Rooms';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <SocketProvider>
          <PlayerProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<Home />} />
              <Route path="/rooms" element={<Rooms />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </PlayerProvider>
        </SocketProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
