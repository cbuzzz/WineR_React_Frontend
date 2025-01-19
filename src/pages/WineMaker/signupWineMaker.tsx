import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import winerLogo from '../../assets/winerlogot.png';
import userService from '../../services/userService';
import '../../styles/login.css'; // Usamos los mismos estilos que Login

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

    // Función para realizar las validaciones
    const validateForm = () => {
        if (!formData.name || !formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
            setError('All fields are required.');
            return false;
        }

        // Validación del nombre (solo letras y espacios)
        const nameRegex = /^[a-zA-Z\s]+$/; // Solo letras y espacios
        if (!nameRegex.test(formData.name)) {
            setError('Name can only contain letters and spaces.');
            return false;
        }

        // Validación del nombre de usuario (solo letras, números y guiones bajos)
        const usernameRegex = /^[a-zA-Z0-9_]+$/; // Letras, números y guiones bajos
        if (!usernameRegex.test(formData.username)) {
            setError('Username can only contain letters, numbers, and underscores.');
            return false;
        }

        // Validación del formato del correo electrónico
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid email address.');
            return false;
        }

        // Validación de la contraseña (al menos 8 caracteres)
        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters long.');
            return false;
        }

        // Validación de la confirmación de la contraseña
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            return false;
        }

        // Validación de aceptación de los términos y condiciones
        if (!formData.agreeToTerms) {
            setError('You must agree to the terms and conditions.');
            return false;
        }

        // Si todas las validaciones son correctas, regresamos true
        return true;
    };

    // Función para manejar el registro
    const handleSignUp = async () => {
        setError('');
        setSuccess('');

        // Validar los datos del formulario
        if (!validateForm()) {
            return;
        }

        try {
            await userService.signup({
                image: '', // Imagen por defecto
                name: formData.name,
                username: formData.username,
                mail: formData.email,
                password: formData.password,
                tipo: 'wineMaker', // Tipo por defecto
                experiences: [],
                amigos: [],
                solicitudes: [],
            });

            setSuccess('Account created successfully! Redirecting to login...');
            setTimeout(() => navigate('/loginWineMaker'), 3000); // Redirigir después del éxito
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unexpected error occurred');
            }
        }
    };

    const handleGoogleSuccess = async (response: any) => {
        try {
            const { user, token } = await userService.googleLoginMaker(response.credential);
            if (user.tipo !== 'wineMaker') {
                setError('Tipo de usuario no válido');
                return;
            }
            localStorage.setItem('auth-token', token);
            if (user && user._id) {
                localStorage.setItem('id', user._id.toString());
                localStorage.setItem('username', user.username);
            }
            setSuccess('Account created successfully! Redirecting to home...');
            setTimeout(() => navigate('/homeWineMaker'), 3000);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unexpected error occurred');
            }
        }
    };

    const handleGoogleFailure = () => {
        console.error('Google signup error');
        setError('Google signup failed');
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="tabs">
                    <span onClick={() => navigate('/loginWineMaker')}>Log in</span>
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
