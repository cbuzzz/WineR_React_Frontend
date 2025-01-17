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
import { FaPhone, FaEnvelope } from 'react-icons/fa'; // Import the icons

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
    const [wineMakerName, setWineMakerName] = useState<string | null>(null);

    useEffect(() => {
        const fetchExperience = async () => {
            try {
                if (id) {
                    const data = await experienceService.getExperienceById(id);
                    setExperience(data);

                    const coords = await getCoordinates(data.location);
                    setCoordinates(coords);

                    const wineMaker = await userService.getUserById(data.owner);
                    setWineMakerName(wineMaker.name);
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
                <h2>{wineMakerName}</h2> {/* Display the name of the WineMaker */}
                <p>
                    <strong>{experience.location}</strong> • {experience.date}
                </p>
                <p>
                    Price: {experience.price} € • {experience.averageRating} ★ ({experience.reviews.length} reviews)
                </p>
                <div className="contact-info" style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', justifyContent: 'center' }}>
                        <FaPhone /> <span>{experience.contactnumber}</span> {/* Telephone number with icon */}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', justifyContent: 'center' }}>
                        <FaEnvelope /> <span>{experience.contactmail}</span> {/* Email with icon */}
                    </div>
                </div>
                <div className="services" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px' }}>
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
        </div>
    );
};

export default ExperienceDetails;
