import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/home.css'; // Usamos los mismos estilos que Home
import NavWineMaker from '../../components/NavWineMaker'; // Asegúrate de que la ruta sea correcta
import userService from '../../services/userService'; // Servicio para obtener los detalles del usuario
import profileBackground from '../../assets/profilebackground.jpg';
import { TimerContext } from '../../components/timercontext';
import { FaUserFriends, FaWineGlassAlt, FaUser, FaEnvelope, FaUserTag, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import defaultProfilePicture from '../../assets/defaultProfilePicture.png';
import { User } from '../../models/userModel';

const ProfileWM: React.FC = () => {
  const [user, setUser] = useState<User | null>(null); // Estado para almacenar los datos del usuario
  const [error, setError] = useState<string>(''); // Estado para manejar errores
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [editData, setEditData] = useState<Partial<User>>({});
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [modalMessage, setModalMessage] = useState<string>('');
  const [modalType, setModalType] = useState<'success' | 'error'>('success');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [formVisible, setFormVisible] = useState<boolean>(true);
  const navigate = useNavigate();
  const timerContext = useContext(TimerContext);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);

  // Hook para obtener el ID del usuario desde el localStorage y hacer la solicitud GET al backend
  useEffect(() => {
    const userId = localStorage.getItem('id');
    if (userId) {
      // Obtener los datos del usuario desde el backend
      userService.getUserById(userId)
        .then((response) => {
          setUser(response); // Guardar los datos del usuario
          setEditData(response);
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

  const handleEditProfile = () => {
    setShowEditModal(true);
  };

  const handleInputChange = (field: keyof User, value: string) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validatePassword = (): boolean => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (newPassword && !passwordRegex.test(newPassword)) {
      setModalMessage('Password must be at least 8 characters long, contain at least one number, one uppercase letter, one lowercase letter, and one special character.');
      setModalType('error');
      setShowModal(true);
      return false;
    }
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleUploadImage = async () => {
    if (user && selectedImage) {
      const formData = new FormData();
      formData.append('image', selectedImage);

      try {
        await userService.uploadProfileImage(user._id!, formData);
        setModalMessage('Profile image updated successfully!');
        setModalType('success');
        setShowModal(true);

        setTimeout(() => {
          setShowModal(false);
          navigate('/loadingWM');
        }, 2000);
      } catch (err) {
        console.error('Error uploading profile image:', err);
        setModalMessage('Failed to upload profile image.');
        setModalType('error');
        setShowModal(true);
      }
    }
    setShowImageModal(false);
  };

  const validateForm = (): boolean => {
    const { name, mail } = editData;

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (mail && !emailRegex.test(mail)) {
      setModalMessage('Please enter a valid email address.');
      setModalType('error');
      setShowModal(true);
      return false;
    }

    if (newPassword && !validatePassword()) {
      return false;
    }

    const nameRegex = /^[a-zA-Z\s]+$/;
    if (name && !nameRegex.test(name)) {
      setModalMessage('Name can only contain letters and spaces.');
      setModalType('error');
      setShowModal(true);
      return false;
    }

    return true;
  };

  const handleSaveChanges = async () => {
    if (user && editData) {
      const isValid = validateForm();
      if (!isValid) return;

      if (newPassword && newPassword !== confirmPassword) {
        setModalMessage('Passwords do not match. Please try again.');
        setModalType('error');
        setShowModal(true);
        return;
      }

      try {
        const updatedData = { ...editData, password: newPassword || undefined };

        const updatedUser = await userService.updateUser(user._id!, updatedData);

        if (updatedUser) {
          setUser(updatedUser);
          setEditData(updatedUser);
          localStorage.setItem('username', user.username);
          setModalMessage('Profile updated successfully!');
          setModalType('success');
          setShowModal(true);
          setFormVisible(false);

          setTimeout(() => {
            setShowModal(false);
            navigate('/loadingWM');
          }, 2000);
        } else {
          setModalMessage('Error saving changes. Please try again.');
          setModalType('error');
          setShowModal(true);
          setFormVisible(false);
        }
      } catch (err) {
        console.error('Error updating user:', err);
        setModalMessage('Error saving changes. Please try again.');
        setModalType('error');
        setShowModal(true);
        setFormVisible(false);
      }
    }
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
            <img
              src={user.image || defaultProfilePicture}
              alt={`${user.username}'s profile`}
              className="profile-picture"
              onClick={() => setShowImageModal(true)} // Abrir el modal al hacer clic
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

        <div className="button-group">
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
          <button className="logout-btn" onClick={handleEditProfile}>Edit Profile</button>
        </div>

        {showEditModal && formVisible && (
          <div className="modal">
            <div className="modal-content">
              <h3>Edit Profile</h3>
              <div>
                <label>Name:</label>
                <input
                  type="text"
                  value={editData.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
              </div>
              <div>
                <label>Email:</label>
                <input
                  type="email"
                  value={editData.mail || ''}
                  onChange={(e) => handleInputChange('mail', e.target.value)}
                />
              </div>
              <div>
                <label>Username:</label>
                <input
                  type="text"
                  value={editData.username || ''}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                />
              </div>
              <div>
                <label>New Password:</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div>
                <label>Confirm Password:</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <div>
                <button onClick={handleSaveChanges}>Save Changes</button>
                <button onClick={() => setShowEditModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {showModal && (
          <div className={`modal ${modalType}`}>
            <div className="modal-content">
              <p>{modalMessage}</p>
            </div>
          </div>
        )}
        {showImageModal && (
          <div className="modal">
            <div className="modal-content">
              <h3>Upload Profile Image</h3>
              <input type="file" accept="image/*" onChange={handleFileChange} />
              <div className="button-group">
                <button onClick={handleUploadImage} disabled={!selectedImage}>
                  Upload
                </button>
                <button onClick={() => setShowImageModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </NavWineMaker>
  );
};

export default ProfileWM;
