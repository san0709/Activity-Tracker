import React, { useState } from 'react';
import LoginScreen from './components/LoginScreen';
import TimeTrackerView from './components/TimeTrackerView';

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  const handleLogin = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <div className="container py-4">
      {currentUser ? (
        <TimeTrackerView user={currentUser} onLogout={handleLogout} />
      ) : (
        <LoginScreen onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
