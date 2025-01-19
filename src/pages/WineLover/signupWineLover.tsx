import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import winerLogo from '../../assets/winerlogot.png';
import userService from '../../services/userService';
import '../../styles/login.css'; // Usaremos los mismos estilos que Login

const SignUp: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeToTerms: false,
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const validateForm = () => {
        if (!formData.name || !formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
            setError('All fields are required.');
            return false;
        }
        // Validaciones adicionales aquí...
        return true;
    };

    const handleSignUp = async () => {
        setError('');
        setSuccess('');

        if (!validateForm()) {
            return;
        }

        try {
            await userService.signup({
                image: '', // No se requiere imagen de perfil
                name: formData.name,
                username: formData.username,
                mail: formData.email,
                password: formData.password,
                tipo: 'wineLover', // Default type
                experiences: [],
                amigos: [],
                solicitudes: [],
            });

            setSuccess('Account created successfully!');
            navigate('/quizPage'); // Redirigir directamente al quiz
        } catch (err) {
            setError('An unexpected error occurred');
        }
    };

    const handleGoogleSuccess = async (response: any) => {
        try {
            const { user, token } = await userService.googleLoginLover(response.credential);
            localStorage.setItem('auth-token', token);
            setSuccess('Account created successfully!');
            navigate('/quizPage'); // Redirigir al quiz
        } catch (err) {
            setError('Google signup failed');
        }
    };

    const handleGoogleFailure = () => {
        setError('Google signup failed');
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="tabs">
                    <span onClick={() => navigate('/loginWineLover')}>Log in</span>
                    <span className="active-tab">Sign up</span>
                </div>
                <div className="form">
                    {error && <div className="error-message">{error}</div>}
                    {success && <div className="success-message">{success}</div>}
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
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
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
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
                                I agree to the <span className="link-terms" onClick={() => navigate('/tyc')}>terms and conditions</span>
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
                        <GoogleOAuthProvider clientId="99436687913-1fvvch8jetgrf2j2r0h96k39db3b7o8c.apps.googleusercontent.com">
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={handleGoogleFailure}
                            />
                        </GoogleOAuthProvider>
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
