import React from 'react';
import './App.css';
import './global.css';
import Register from './components/Register';
import Login from './components/Login';
import Home from './components/Home';
import PrivateRoute from './components/PrivateRoute';
import UpdateProfile from './components/UpdateProfile';
import ForgotPassword from './components/ForgotPassword';
import Movies from './components/Movies';
import Settings from './components/Settings';
import UpdateEmail from './components/UpdateEmail';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { IconProvider } from './context/IconContext';
import { AuthProvider } from './context/AuthContext';
import UpdatePassword from './components/UpdatePassword';
import MovieList from './components/MovieList';
import ChatPage from './components/ChatPage';

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
            <Route path="chat/:usernames" element={
              <PrivateRoute>
                <ChatPage/>
              </PrivateRoute>
            }
             />
            <Route path="/UpdateProfile" element={
              <PrivateRoute>
                <UpdateProfile />
              </PrivateRoute>
            } />
            <Route path="/Movies" element={
              <PrivateRoute>
                <Movies />
              </PrivateRoute>
            } />
             <Route path="/MovieList" element={
              <PrivateRoute>
                <MovieList/>
              </PrivateRoute>
            } />
            <Route path="/UpdateEmail" element={
              <PrivateRoute>
                <UpdateEmail/>
              </PrivateRoute>
            } />
            <Route path="/UpdatePassword" element={
              <PrivateRoute>
                <UpdatePassword/>
              </PrivateRoute>
            } />
            <Route path="/Settings" element={
              <PrivateRoute>
                <Settings/>
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
