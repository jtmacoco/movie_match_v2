import React from 'react';
import './App.css';
import Register from './components/Register';
import Login from './components/Login';
import Home from './components/Home';
import './global.css';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { IconProvider } from './context/IconContext';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <ThemeProvider>
      <IconProvider>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/Home" element={<Home/>} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </AuthProvider>
      </IconProvider>
    </ThemeProvider>
  );
}

export default App;
