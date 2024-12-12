import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/home.css'; // Usamos los mismos estilos que Home
import NavWineMaker from '../../components/NavWineMaker'; // Asegúrate de que la ruta sea correcta
import userService from '../../services/userService'; // Servicio para obtener los detalles del usuario
import profileBackground from '../../assets/profilebackground.jpg';
import { TimerContext } from '../../components/timercontext';

// Define la interfaz del usuario
interface User {
  _id?: string;
  username: string;
  name: string;
  mail: string;
  password: string;
  tipo: 'admin' | 'wineLover' | 'wineMaker';
  habilitado: boolean;
  experiences: string[];
}

const ProfileWM: React.FC = () => {
  const [user, setUser] = useState<User | null>(null); // Estado para almacenar los datos del usuario
  const [error, setError] = useState<string>(''); // Estado para manejar errores
  const navigate = useNavigate();
  const timerContext = useContext(TimerContext);

  // Hook para obtener el ID del usuario desde el localStorage y hacer la solicitud GET al backend
  useEffect(() => {
    const userId = localStorage.getItem('id');
    if (userId) {
      // Obtener los datos del usuario desde el backend
      userService.getUserById(userId)
        .then((response) => {
          setUser(response); // Guardar los datos del usuario
        })
        .catch((err) => {
          setError('Error fetching user data');
          console.error(err);
        });
    } else {
      setError('User ID not found in localStorage');
    }
  }, []); // Solo ejecuta este efecto una vez cuando el componente se monta

  // Función para hacer logout
  const handleLogout = () => {
    if (timerContext) {
      timerContext.stopTimer(); // Detiene el temporizador al hacer logout
    }
    localStorage.clear(); // Limpia el localStorage
    navigate('/'); // Redirigir a la página de bienvenida
  };

  if (!user) {
    return <div>Loading...</div>; // Mostrar un mensaje mientras cargan los datos
  }

  return (
    <NavWineMaker>
      <div className="home-container">
        <div
          className="top-plans"
          style={{ backgroundImage: `url(${profileBackground})` }}
        >
          <div className="top-plans-content">
            <h1>{user.username}'s Profile</h1>
            <p>Welcome to your profile page</p>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>} {/* Mostrar el mensaje de error si ocurre */}

        <div className="profile-info">
          <h2>User Information</h2>
          <div className="profile-details">
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.mail}</p>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Account Type:</strong> {user.tipo}</p>
            <p><strong>Status:</strong> {user.habilitado ? 'Active' : 'Inactive'}</p>
          </div>
        </div>

        {/* Botón de Logout */}
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </NavWineMaker>
  );
};

export default ProfileWM;
