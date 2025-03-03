import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import winerLogo from '../../assets/winerlogot.png';
import userService from '../../services/userService';
import { TimerContext } from '../../components/timercontext';
import '../../styles/login.css';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [redirectToWineLover, setRedirectToWineLover] = useState(false); // Estado para manejar la redirección
    const [showModal, setShowModal] = useState(false); // Estado para mostrar el modal
    const timerContext = useContext(TimerContext);
    const navigate = useNavigate();

    // Borrar el contenido del localStorage cuando se abra la página de login
    useEffect(() => {
        localStorage.clear(); // Limpia todo el contenido del localStorage
    }, []); // Solo ejecutarlo una vez al cargar el componente

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

            localStorage.setItem('auth-token', token); // Guardar el token en localStorage
            console.log('Logged in successfully:', user);
            if (user && user._id) {
                localStorage.setItem('id', user._id.toString());
                localStorage.setItem('username', user.username.toString())
            } else {
                console.log('User ID not found or user object is invalid');
            }

            if (timerContext) {
                timerContext.startTimer(); // Llama a startTimer solo si el contexto no es null
            } else {
                console.error('TimerContext is not available');
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

    const handleGoogleSuccess = async (response: any) => {
        try {
            const { user, token } = await userService.googleLoginMaker(response.credential);
            if (user.tipo !== 'wineMaker') {
                if (user.tipo === 'wineLover') {
                    setRedirectToWineLover(true);
                    setShowModal(true);
                } else {
                    setError('Tipo de usuario no válido');
                }
                return;
            }
            localStorage.setItem('auth-token', token);
            if (user && user._id) {
                localStorage.setItem('id', user._id.toString());
                localStorage.setItem('username', user.username);
            }
            if (timerContext) {
                timerContext.startTimer();
            }
            navigate('/homeWineMaker');
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unexpected error occurred');
            }
        }
    };

    const handleGoogleFailure = () => {
        console.error('Google login error');
        setError('Google login failed');
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
