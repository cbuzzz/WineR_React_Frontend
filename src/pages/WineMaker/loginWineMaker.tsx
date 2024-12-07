import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import winerLogo from '../../assets/winerlogot.png';
import userService from '../../services/userService';
import '../../styles/login.css';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [redirectToWineLover, setRedirectToWineLover] = useState(false); // Estado para manejar la redirección
    const [showModal, setShowModal] = useState(false); // Estado para mostrar el modal
    const navigate = useNavigate();

    const handleLogin = async () => {
        setError(''); // Limpiar errores previos
        try {
            // Intentar loguearse con el usuario y la contraseña
            const { user, token } = await userService.login(username, password);
            
            // Verificar si el usuario es un WineMaker
            if (user.tipo !== 'wineMaker') {
                // Si el usuario no es un WineMaker, comprobar si es un WineLover
                if (user.tipo === 'wineLover') {
                    setRedirectToWineLover(true); // Activar la opción de redirigir a WineLover
                    setShowModal(true); // Mostrar el modal para preguntar
                } else {
                    setError('Tipo de usuario no válido');
                }
                return;
            }

            localStorage.setItem('token', token); // Guardar el token en localStorage
            console.log('Logged in successfully:', user);
            if (user && user._id) {
                localStorage.setItem('id', user._id.toString());
                console.log('User ID saved to localStorage:', user._id.toString());
            } else {
                console.log('User ID not found or user object is invalid');
            }
            navigate('/homeWineMaker'); // Redirigir al home de WineMaker

        } catch (err) {
            if (err instanceof Error) {
                console.error('Login error:', err.message);
                setError(err.message); // Mostrar el error específico del backend
            } else {
                setError('An unexpected error occurred');
            }
        }
    };

    // Función para cerrar el modal
    const closeModal = () => {
        setShowModal(false);
    };

    // Función para redirigir al login de WineLover
    const redirectToWineLoverLogin = () => {
        navigate('/loginWineLover');
        setShowModal(false); // Cerrar el modal después de la redirección
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <h2>Welcome, WineMaker!</h2>
                </div>
                <div className="tabs">
                    <span
                        className="active-tab"
                        onClick={() => navigate('/loginWineMaker')}
                    >
                        Log in
                    </span>
                    <span
                        onClick={() => navigate('/signupWineMaker')}
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

            {/* Modal de confirmación */}
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>¿Eres un WineLover?</h3>
                        <p>Has intentado iniciar sesión como un WineMaker, pero parece que eres un WineLover. ¿Te gustaría redirigirte al login de WineLover?</p>
                        <div className="modal-actions">
                            <button onClick={redirectToWineLoverLogin}>Sí</button>
                            <button onClick={closeModal}>No</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;