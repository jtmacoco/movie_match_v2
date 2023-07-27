import React from 'react';
import { Routes, Route } from "react-router-dom"
import './App.css';
import Register from './components/Register';
import Login from './components/Login';
import "./global.css"
function App() {
  return (
    <>
      <Routes>
        <Route id="login" path="/" element={
            <Login />
        } />
        <Route id="register" path="/register" element={
            <Register/>
        } />

      </Routes>
    </>

  );
}

export default App;
