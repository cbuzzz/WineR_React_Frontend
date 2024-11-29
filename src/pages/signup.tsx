import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import winerLogo from '../assets/winerlogot.png';
import '../styles/login.css'; // Usaremos los mismos estilos que Login

const SignUp: React.FC = () => {
    const [formData, setFormData] = useState({
        Name: '',
        username: '',
        email: '',
        password: '',
        agreeToTerms: false,
    });

    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSignUp = () => {
        console.log('Signing up with:', formData);
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="tabs">
                    <span
                        onClick={() => navigate('/login')}
                    >
                        Log in
                    </span>
                    <span className="active-tab">Sign up</span>
                </div>
                <div className="form">
                    <label htmlFor="first-name">Name</label>
                    <input
                        type="text"
                        id="first-name"
                        name="firstName"
                        placeholder="Enter your name"
                        value={formData.Name}
                        onChange={handleChange}
                    />
                    <label htmlFor="last-name">Username</label>
                    <input
                        type="text"
                        id="last-name"
                        name="lastName"
                        placeholder="Enter your username"
                        value={formData.username}
                        onChange={handleChange}
                    />
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <label htmlFor="password">Confirm Password</label>
                    <input
                        type="confirmpassword"
                        id="confirmpassword"
                        name="confirmpassword"
                        placeholder="Confirm your password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <div className="terms">
                        <label>
                            <input
                                type="checkbox"
                                id="agreeToTerms"
                                name="agreeToTerms"
                                checked={formData.agreeToTerms}
                                onChange={handleChange}
                            />
                            <label htmlFor="agreeToTerms">
                                I agree to the <a href="/terms">terms and conditions</a>
                            </label>
                        </label>
                    </div>
                    <button className="continue-btn" onClick={handleSignUp}>
                        Sign Up
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

export default SignUp;
