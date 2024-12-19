import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../styles/experiencedetails.css'; // Asegúrate de tener el mismo archivo de estilos
import experienceService from '../../services/experienceService';
import userService from '../../services/userService';
import { Experience } from '../../models/experienceModel';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { getCoordinates } from '../../utils/geocoding';

// Configuración de los íconos de Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});

const ExperienceDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [experience, setExperience] = useState<Experience | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
    const [showModal, setShowModal] = useState(false); // Controlar si el modal se muestra o no
    const [modalMessage, setModalMessage] = useState(''); // Mensaje que se mostrará en el modal

    useEffect(() => {
        const fetchExperience = async () => {
            try {
                if (id) {
                    const data = await experienceService.getExperienceById(id);
                    setExperience(data);

                    const coords = await getCoordinates(data.location);
                    setCoordinates(coords);
                }
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('An unexpected error occurred');
                }
            }
        };

        fetchExperience();
    }, [id]);

    const handleBookNow = async () => {
        try {
            const userId = localStorage.getItem('id'); // Obtener el ID del usuario desde localStorage
            if (!userId || !experience || !id) {
                setModalMessage('User not logged in or experience not found.');
                setShowModal(true); // Mostrar el modal de error
                setTimeout(() => setShowModal(false), 2000); // Cerrar el modal después de 2 segundos
                return;
            }

            // Verificar si el usuario ya tiene la experiencia
            const user = await userService.getUserById(userId);
            const experienceExists = user.experiences.some((expId: string) => expId === id);

            if (experienceExists) {
                // Si ya tiene la experiencia, mostrar el mensaje de "Ya estás apuntado"
                setModalMessage('Ya estás apuntado a esta experiencia.');
                setShowModal(true); // Mostrar el modal de aviso
                setTimeout(() => setShowModal(false), 2000); // Cerrar el modal después de 2 segundos
            } else {
                // Si no está apuntado, proceder con la reserva
                await experienceService.addUserToExperience(id, userId);
                await userService.addExperienceToUser(id, userId);

                setModalMessage('Booking successful!');
                setShowModal(true); // Mostrar el modal de éxito

                setTimeout(() => {
                    setShowModal(false); // Cerrar el modal después de 2 segundos
                    navigate('/booking'); // Redirigir a la página de reservas
                }, 2000); // Cerrar el modal después de 2 segundos
            }
        } catch (err) {
            console.error(err);
            setModalMessage('Booking failed. Please try again.');
            setShowModal(true); // Mostrar el modal de error
            setTimeout(() => setShowModal(false), 2000); // Cerrar el modal después de 2 segundos
        }
    };

    if (error) {
        return (
            <div className="experience-details">
                <button onClick={() => navigate(-1)}>← Back</button>
                <p className="error-message">{error}</p>
            </div>
        );
    }

    if (!experience) {
        return (
            <div className="experience-details">
                <button onClick={() => navigate(-1)}>← Back</button>
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="experience-details">
            {/* Mostrar el modal solo si showModal es true */}
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>{modalMessage}</h3> {/* El mensaje que cambia dinámicamente */}
                    </div>
                </div>
            )}

            <div className="header">
                <button onClick={() => navigate(-1)}>← Back</button>
                <h1>{experience.title}</h1>
                <button className="favorite">♡</button>
            </div>

            <div className="details">
                <h2>{experience.contactmail}</h2>
                <p>
                    <strong>{experience.location}</strong> • {experience.date}
                </p>
                <p>
                    Price: {experience.price} € • {experience.averagerating} ★ ({experience.reviews.length} reviews)
                </p>
                <div className="services">
                    {experience.services.map((service, index) => (
                        <div key={index} className="service">
                            <span>{service.icon}</span>
                            <p>{service.label}</p>
                        </div>
                    ))}
                </div>

                <h3>About</h3>
                <p>{experience.description}</p>

                <h3>Location</h3>

                <div className="map">
                    {coordinates ? (
                        <MapContainer center={coordinates} zoom={13} style={{ height: '400px', width: '100%' }}>
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
                            />
                            <Marker position={coordinates}>
                                <Popup>{experience.location}</Popup>
                            </Marker>
                        </MapContainer>
                    ) : (
                        <p>Loading map...</p>
                    )}
                </div>
            </div>
            <button className="book-now" onClick={handleBookNow}>Book Now</button>
        </div>
    );
};

export default ExperienceDetails;
