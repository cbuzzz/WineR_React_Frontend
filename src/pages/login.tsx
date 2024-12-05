import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import winerLogo from '../assets/winerlogot.png';
import userService from '../services/userService';
import '../styles/login.css';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        setError(''); // Clear any previous error
        try {
            const { user, token } = await userService.login(username, password);
            localStorage.setItem('token', token);
            console.log('Logged in successfully:', user);
            navigate('/home');
        } catch (err) {
            if (err instanceof Error) {
                console.error('Login error:', err.message);
                setError(err.message); // Display specific error from the backend
            } else {
                setError('An unexpected error occurred');
            }
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="tabs">
                    <span
                        className="active-tab"
                        onClick={() => navigate('/login')}
                    >
                        Log in
                    </span>
                    <span
                        onClick={() => navigate('/signup')}
                    >
                        Sign up
                    </span>
                </div>
                <div className="form">
                    {error && <div className="error-message">{error}</div>}
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button className="continue-btn" onClick={handleLogin}>
                        Continue
                    </button>
                    <div className="separator">
                        <span>or</span>
                    </div>
                    <div className="alternative-login">
                        <button className="alt-login-btn google-btn">
                            Continue with Google
                        </button>
                        <button className="alt-login-btn apple-btn">
                            Continue with Apple
                        </button>
                    </div>
                </div>
            </div>
            <div className="login-image">
                <img src={winerLogo} alt="WineR Logo" />
            </div>
        </div>
    );
};

export default Login;
