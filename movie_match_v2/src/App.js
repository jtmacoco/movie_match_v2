import React from 'react';
import './App.css';
import Login from './components/Login';
import "./global.css"
function App() {
  return (
    <>
    <div id="login" className='bg-login_background_color login-background'>
      <Login/>
    </div>
    </>

  );
}

export default App;
