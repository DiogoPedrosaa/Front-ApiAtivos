// src/App.js
import React, { useState } from 'react';
import Ativos from './components/Ativos';
import Login from './components/Login';
import './App.css';

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLogin = () => {
        setIsLoggedIn(true);
    };

    return (
        <div>
            {isLoggedIn ? <Ativos /> : <Login onLogin={handleLogin} />}
        </div>
    );
};

export default App;
