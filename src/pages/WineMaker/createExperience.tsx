import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import experienceService from '../../services/experienceService';
import '../../styles/login.css'; // Usamos los mismos estilos que Login

const CreateExperience: React.FC = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: 0,
        location: '',
        contactnumber: 0,
        contactmail: '',
        date: '',
        services: [],  // Inicializado como vacío, puedes agregar servicios si es necesario
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    // Se obtiene el ID del propietario (por ejemplo, el ID del usuario autenticado)
    const ownerId = "user-id"; // Esto debe reemplazarse con el ID del usuario autenticado

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

        // Aquí añadimos el propietario de la experiencia, por ejemplo, el ID del usuario autenticado
        const experienceData = {
            ...formData,
            owner: ownerId,
            participants: [], // Este campo puede ser vacío o inicializado según tu lógica
            rating: 0,         // Puedes configurar un valor predeterminado si lo deseas
            reviews: [],       // Similarmente, inicializa este campo si es necesario
        };

        try {
            await experienceService.createExperience(experienceData);
            setSuccess('Experience created successfully! Redirecting...');
            setTimeout(() => navigate('/homeWineMaker'), 3000); // Redirect after success
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unexpected error occurred');
            }
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="tabs">
                    <span onClick={() => navigate('/homeWineMaker')}>Home</span>
                    <span className="active-tab">Create Experience</span>
                </div>
                <div className="form">
                    {error && <div className="error-message">{error}</div>}
                    {success && <div className="success-message">{success}</div>}

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

                    <div className="separator">
                        <span>or</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateExperience;
