import React from 'react';
import { Routes, Route } from "react-router-dom"
import './App.css';
import Register from './components/Register';
import Login from './components/Login';
import "./global.css"
import { ThemeProvider } from "./context/ThemeContext";
import { IconProvider } from './context/IconContext';
function App() {
  return (
    <>
      <Routes>
        <Route id="login" path="/" element={
          <ThemeProvider>
            <IconProvider>
              <Login />
            </IconProvider>
          </ThemeProvider>
        } />
        <Route id="register" path="/register" element={
          <Register />
        } />

      </Routes>
    </>

  );
}

export default App;
