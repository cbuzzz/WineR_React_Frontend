import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/home.css'; // Usamos los mismos estilos que Home
import NavWineMaker from '../../components/NavWineMaker'; // Asegúrate de que la ruta sea correcta
import experienceService from '../../services/experienceService';
import createBackground from '../../assets/vinito.png';

const CreateExperience: React.FC = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: 0,
        location: '',
        contactnumber: 0,
        contactmail: '',
        date: '',
        services: [],
        owner: '', // Inicializamos el campo owner vacío
    });

    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false); // Estado para el modal de éxito
    const navigate = useNavigate();

    // Hook para obtener el ID del propietario desde el localStorage
    useEffect(() => {
        const userId = localStorage.getItem('id');
        if (userId) {
            setFormData((prevData) => ({
                ...prevData,
                owner: userId, // Asignamos el ID del usuario al campo owner
            }));
        } else {
            setError('User ID not found in localStorage');
        }
    }, []); // Solo ejecuta este efecto una vez cuando el componente se monta

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        setError('');
        setShowModal(false); // Asegurarnos de que el modal esté oculto al inicio del envío

        const experienceData = {
            ...formData,
            participants: [], // Inicialmente vacío (arreglo de strings)
            rating: Math.round(Math.random() * 5),  // Valor predeterminado aleatorio de la puntuación
            reviews: [],      // Inicialmente vacío (arreglo de strings)
        };

        try {
            console.log(experienceData);
            await experienceService.createExperience(experienceData); // Se envía la experiencia al backend
            setShowModal(true); // Mostrar el modal de éxito

            // Redirigir después de un corto periodo de tiempo (3 segundos)
            setTimeout(() => {
                setShowModal(false); // Cerrar el modal
                navigate('/homeWineMaker'); // Redirigir al homeWineMaker
            }, 3000); // 3 segundos de espera antes de la redirección
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unexpected error occurred');
            }
        }
    };

    return (
        <NavWineMaker> {/* El contenido de la página está dentro de NavWineMaker */}
            <div className="home-container">
                <div
                    className="top-plans"
                    style={{ backgroundImage: `url(${createBackground})` }}
                >
                    <div className="top-plans-content">
                        <h1>Create</h1>
                        <h2>WineMaker Experience</h2>
                        <p>Design your unique experience</p>
                    </div>
                </div>

                {error && <div className="error-message">{error}</div>} {/* Muestra el mensaje de error si ocurre */}

                <div className="form">
                    <label style={{ fontWeight: 'bold', color: 'white' }} htmlFor="title">Title</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        placeholder="Enter experience title"
                        value={formData.title}
                        onChange={handleChange}
                    />

                    <label style={{ fontWeight: 'bold', color: 'white' }} htmlFor="description">Description</label>
                    <textarea
                        style={{ resize: 'none', width: 860 }}
                        id="description"
                        name="description"
                        placeholder="Enter the experience description"
                        rows={4}
                        value={formData.description}
                        onChange={handleChange}
                    />

                    <label style={{ fontWeight: 'bold', color: 'white' }} htmlFor="price">Price (€)</label>
                    <input
                        type="number"
                        id="price"
                        name="price"
                        placeholder="Enter price"
                        value={formData.price}
                        onChange={handleChange}
                    />

                    <label style={{ fontWeight: 'bold', color: 'white' }} htmlFor="location">Location</label>
                    <input
                        type="text"
                        id="location"
                        name="location"
                        placeholder="Enter the experience location"
                        value={formData.location}
                        onChange={handleChange}
                    />

                    <label style={{ fontWeight: 'bold', color: 'white' }} htmlFor="contactnumber">Contact Number</label>
                    <input
                        type="tel"
                        id="contactnumber"
                        name="contactnumber"
                        placeholder="Enter the contact number"
                        value={formData.contactnumber}
                        onChange={handleChange}
                    />

                    <label style={{ fontWeight: 'bold', color: 'white' }} htmlFor="contactmail">Contact Email</label>
                    <input
                        type="email"
                        id="contactmail"
                        name="contactmail"
                        placeholder="Enter the contact email"
                        value={formData.contactmail}
                        onChange={handleChange}
                    />

                    <label style={{ fontWeight: 'bold', color: 'white' }} htmlFor="date">Date</label>
                    <input
                        type="date"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                    />

                    <button className="create-btn" onClick={handleSubmit}>
                        Create Experience
                    </button>
                </div>
            </div>

            {/* Modal de éxito */}
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Experience created successfully! Redirecting...</h3>
                    </div>
                </div>
            )}
        </NavWineMaker>
    );
};

export default CreateExperience;
