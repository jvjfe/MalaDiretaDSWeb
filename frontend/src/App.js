import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login/Login.js';
import Home from './pages/Home';

function App() {
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem('isAdmin') === 'true');

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAdmin(localStorage.getItem('isAdmin') === 'true');
    };

    window.addEventListener('storage', handleStorageChange);

    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login setIsAdmin={setIsAdmin} />} />
        <Route
          path="/home"
          element={isAdmin ? <Home /> : <Navigate to="/" replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;
