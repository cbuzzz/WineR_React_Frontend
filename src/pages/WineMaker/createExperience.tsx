import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/home.css'; // Usamos los mismos estilos que Home
import NavWineMaker from '../../components/NavWineMaker'; // Asegúrate de que la ruta sea correcta
import experienceService from '../../services/experienceService';

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
    const [success, setSuccess] = useState('');
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
        setSuccess('');

        const experienceData = {
            ...formData,
            participants: [], // Inicialmente vacío (arreglo de strings)
            rating: 0,        // Valor predeterminado de la puntuación
            reviews: [],      // Inicialmente vacío (arreglo de strings)
        };

        try {
            console.log(experienceData)
            await experienceService.createExperience(experienceData); // Se envía la experiencia al backend
            setSuccess('Experience created successfully! Redirecting...');
            setTimeout(() => navigate('/homeWineMaker'), 3000); // Redirige después de crear la experiencia
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unexpected error occurred');
            }
        }
    };

    return (
        <div className="home-container">
            <NavWineMaker />
            <div
                className="top-plans"
                style={{
                    backgroundImage: 'url("../../assets/top-plans-background.jpg")',
                }}
            >
                <div className="top-plans-content">
                    <h1>Create</h1>
                    <h2>WineMaker Experience</h2>
                    <p>Design your unique experience</p>
                </div>
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <div className="form">
                <label htmlFor="title">Title</label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    placeholder="Enter experience title"
                    value={formData.title}
                    onChange={handleChange}
                />

                <label htmlFor="description">Description</label>
                <textarea
                    id="description"
                    name="description"
                    placeholder="Enter experience description"
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                />

                <label htmlFor="price">Price (€)</label>
                <input
                    type="number"
                    id="price"
                    name="price"
                    placeholder="Enter price"
                    value={formData.price}
                    onChange={handleChange}
                />

                <label htmlFor="location">Location</label>
                <input
                    type="text"
                    id="location"
                    name="location"
                    placeholder="Enter experience location"
                    value={formData.location}
                    onChange={handleChange}
                />

                <label htmlFor="contactnumber">Contact Number</label>
                <input
                    type="tel"
                    id="contactnumber"
                    name="contactnumber"
                    placeholder="Enter contact number"
                    value={formData.contactnumber}
                    onChange={handleChange}
                />

                <label htmlFor="contactmail">Contact Email</label>
                <input
                    type="email"
                    id="contactmail"
                    name="contactmail"
                    placeholder="Enter contact email"
                    value={formData.contactmail}
                    onChange={handleChange}
                />

                <label htmlFor="date">Date</label>
                <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                />

                <button className="continue-btn" onClick={handleSubmit}>
                    Create Experience
                </button>
            </div>
        </div>
    );
};

export default CreateExperience;
