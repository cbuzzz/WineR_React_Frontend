import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import winerLogo from '../assets/winerlogot.png';
import '../styles/login.css';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        // Aquí deberías realizar la lógica de autenticación
        console.log('Logging in with:', { email, password });
        navigate('/home');
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
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
