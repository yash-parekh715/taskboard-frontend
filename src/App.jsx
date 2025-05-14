import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Errorpopup from './components/Errorpopup.jsx';
// import { socketRef } from './features/socket.js';
// import { useDispatch } from 'react-redux';
// import { addEvent } from './features/eventSlice.js';
// import { addTask } from './features/taskSlice.js';
// import { addSubtask } from './features/subtaskSlice.js';

const App = () => {

  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');  // Retrieve token from localStorage
    const url = import.meta.env.VITE_API_AUTH_URL; // Base URL for API
    if (token) {
      // Send token in Authorization header as "Bearer <token>"
      fetch(`${url}/verifyToken`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include token in Authorization header
        },
        body: JSON.stringify({}) // Body can be empty or carry other data if needed
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.message === 'Token is valid') {
            // Token is valid, navigate to dashboard
            navigate('/dashboard');
          } else {
            // If token is invalid, remove it from localStorage and redirect to login
            setError(data.message);
            localStorage.removeItem('token');
            navigate('/');
          }
        })
        .catch(() => {
          setError('Server validation failed.');
          localStorage.removeItem('token');
          navigate('/');
        });
    } else {
      navigate('/');
    }
  }, [navigate]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
      {error && <Errorpopup message={error} onClose={() => setError(null)} />}
    </>
  );
};

export default App;
