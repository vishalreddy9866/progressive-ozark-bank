import React, { useState, useEffect } from 'react';
import Login from './Login';
import Dashboard from './Dashboard';

function App() {
  // Check if a token already exists in LocalStorage on startup
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('pob_token'));

  // This function is passed to Login.jsx to trigger the view switch
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  return (
    <main>
      {isLoggedIn ? (
        <Dashboard key ="secure-session-active"/>
      ) : (
        <Login onLoginSuccess={handleLoginSuccess} />
      )}
    </main>
  );
}

export default App;