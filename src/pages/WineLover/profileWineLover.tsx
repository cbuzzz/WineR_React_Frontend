import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/home.css'; // Usamos los mismos estilos que Home
import NavWineLover from '../../components/NavWineLover'; // Asegúrate de que la ruta sea correcta
import userService from '../../services/userService'; // Servicio para obtener los detalles del usuario
import profileBackground from '../../assets/profilebackground.jpg';
import { TimerContext } from '../../components/timercontext';
import { FaStar, FaUserFriends, FaWineGlassAlt, FaUser, FaEnvelope, FaUserTag, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'; // Import additional icons
import defaultProfilePicture from '../../assets/defaultProfilePicture.png'; // Import default profile picture

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
  amigos: string[];
  solicitudes: string[];
  profilePicture?: string; // URL de la foto de perfil
}

const ProfileWL: React.FC = () => {
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

  // Función para redirigir a la página de edición del perfil
  const handleEditProfile = () => {
    navigate('/edit-profile'); // Redirigir a la página de edición del perfil
  };

  if (!user) {
    return <div>Loading...</div>; // Mostrar un mensaje mientras cargan los datos
  }

  return (
    <NavWineLover>
      <div className="home-container">
        <div
          className="top-plans"
          style={{ backgroundImage: `url(${profileBackground})` }}
        >
          <div className="top-plans-content">
            <h1>{user.username}'s Profile</h1>
            <img
              src={user.profilePicture || defaultProfilePicture}
              alt={`${user.username}'s profile`}
              className="profile-picture"
            />
            <p>Welcome to your profile page</p>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>} {/* Mostrar el mensaje de error si ocurre */}

        <div className="profile-info">
          <h2>User Information</h2>
          <div className="stats-details">
            <p><FaUser className="icon" /> <strong>Name:</strong> {user.name}</p>
            <p><FaEnvelope className="icon" /> <strong>Email:</strong> {user.mail}</p>
            <p><FaUserTag className="icon" /> <strong>Username:</strong> {user.username}</p>
            <p><FaUser className="icon" /> <strong>Account Type:</strong> {user.tipo}</p>
            <p>{user.habilitado ? <FaCheckCircle className="icon" /> : <FaTimesCircle className="icon" />} <strong>Status:</strong> {user.habilitado ? 'Active' : 'Inactive'}</p>
          </div>

          <h2>Activity</h2>
          <div className="stats-details">
            <p><FaUserFriends className="icon" /> <strong>Friends:</strong> {user.amigos.length}</p>
            <p><FaWineGlassAlt className="icon" /> <strong>Experiences:</strong> {user.experiences.length}</p>
          </div>
        </div>

        {/* Botones de Logout y Edit Profile */}
        <div className="button-group">
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
          <button className="logout-btn" onClick={handleEditProfile}>Edit Profile</button>
        </div>
      </div>
    </NavWineLover>
  );
};

export default ProfileWL;
