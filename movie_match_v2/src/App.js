import React from 'react';
import './App.css';
import './global.css';
import Register from './components/Register';
import Login from './components/Login';
import Home from './components/Home';
import PrivateRoute from './components/PrivateRoute';
import UpdateProfile from './components/UpdateProfile';
import ForgotPassword from './components/ForgotPassword';
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
            <Route path="/Home" element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            } />
            <Route path="/UpdateProfile" element={
              <PrivateRoute>
                <UpdateProfile/>
              </PrivateRoute>
            } />
            <Route path="/ForgotPassword" element={<ForgotPassword />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </AuthProvider>
      </IconProvider>
    </ThemeProvider>
  );
}

export default App;
