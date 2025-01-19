import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../styles/experiencedetails.css';
import experienceService from '../../services/experienceService';
import userService from '../../services/userService';
import wineService from '../../services/wineService';
import { Experience } from '../../models/experienceModel';
import { Wine } from '../../models/wineModel';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { getCoordinates } from '../../utils/geocoding';
import { FaPhone, FaEnvelope, FaWineBottle } from 'react-icons/fa';
import NavWineMaker from '../../components/NavWineMaker';
import defaultWineImage from '../../assets/winebottleint.png';

// Leaflet icon configuration
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
    const [wine, setWine] = useState<Wine | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [wineMakerName, setWineMakerName] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (id) {
                    // Fetch experience data
                    const expData = await experienceService.getExperienceById(id);
                    setExperience(expData);

                    // Get coordinates for the map
                    const coords = await getCoordinates(expData.location);
                    setCoordinates(coords);

                    // Get winemaker information
                    const wineMaker = await userService.getUserById(expData.owner);
                    setWineMakerName(wineMaker.name);

                    // Fetch wines associated with the experience
                    const winesPromise = expData.wines && expData.wines.length > 0
                        ? wineService.getWineById(expData.wines[0])  // Get first wine if exists
                        : null;

                    if (winesPromise) {
                        try {
                            const wineData = await winesPromise;
                            setWine(wineData);
                        } catch (wineErr) {
                            console.error('Error fetching wine:', wineErr);
                            // Don't set error state here to allow experience to show even if wine fetch fails
                        }
                    }
                }
            } catch (err) {
                console.error('Error fetching data:', err);
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('An unexpected error occurred');
                }
            }
        };

        fetchData();
    }, [id]);

    const handleManageExperience = () => {
        if (experience) {
            // Redirigir a la página de gestión de la experiencia pasando el id
            navigate(`/manageExpWM/${experience._id}`);
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
        <NavWineMaker>
            <div className="container-experiencedetails">
                {showModal && (
                    <div className="modal-experiencedetails">
                        <div className="modal-content-experiencedetails">
                            <h3 className="modal-title-experiencedetails">{modalMessage}</h3>
                        </div>
                    </div>
                )}

                <div className="header-experiencedetails">
                    <button className="back-button-experiencedetails" onClick={() => navigate(-1)}>← Back</button>
                    <h1 className="title-experiencedetails">{experience.title}</h1>
                </div>

                <div className="layout-experiencedetails">
                    <div className="left-column-experiencedetails">
                        <div className="wine-section-experiencedetails">
                            <h2 className="wine-title-experiencedetails"><FaWineBottle /> Featured Wine</h2>
                            <div className="wine-content-container">
                                <div className="wine-image-container">
                                    <img
                                        src={wine?.image || defaultWineImage}
                                        alt={wine?.name || 'Wine'}
                                        className="wine-image-experiencedetails"
                                    />
                                </div>
                                {wine && (
                                    <div className="wine-details-experiencedetails">
                                        <h3 className="wine-name-experiencedetails">{wine.name}</h3>
                                        <p className="wine-info-experiencedetails">Brand: {wine.brand}</p>
                                        <p className="wine-info-experiencedetails">Year: {wine.year}</p>
                                        <p className="wine-info-experiencedetails">Type: {wine.grapetype}</p>
                                        <p className="wine-info-experiencedetails">Price: {wine.price}€</p>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="info-section-experiencedetails">
                            <h2 className="section-title-experiencedetails">Experience Details</h2>
                            <h3 className="winemaker-name-experiencedetails">{wineMakerName}</h3>
                            <p className="location-date-experiencedetails">
                                <strong>{experience.location}</strong> • {experience.date}
                            </p>
                            <p className="price-rating-experiencedetails">
                                Price: {experience.price}€ • {experience.averageRating} ★
                                ({experience.reviews.length} reviews)
                            </p>

                            <div className="contact-info-experiencedetails">
                                <div className="contact-item-experiencedetails">
                                    <FaPhone /> <span>{experience.contactnumber}</span>
                                </div>
                                <div className="contact-item-experiencedetails">
                                    <FaEnvelope /> <span>{experience.contactmail}</span>
                                </div>
                            </div>

                            <div className="services-experiencedetails">
                                {experience.services.map((service, index) => (
                                    <div key={index} className="service-item-experiencedetails">
                                        <span className="service-icon-experiencedetails">{service.icon}</span>
                                        <p className="service-label-experiencedetails">{service.label}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="description-experiencedetails">
                                <h3 className="description-title-experiencedetails">About</h3>
                                <p className="description-text-experiencedetails">{experience.description}</p>
                            </div>
                        </div>
                    </div>

                    <div className="right-column-experiencedetails">
                        <div className="experience-image-container-experiencedetails">
                            <img
                                src={experience.image || '/placeholder-image.jpg'}
                                alt={experience.title}
                                className="experience-image-experiencedetails"
                            />
                        </div>
                        <div className="map-container-experiencedetails">
                            <h2 className="map-title-experiencedetails">Location</h2>
                            {coordinates ? (
                                <MapContainer
                                    center={coordinates}
                                    zoom={13}
                                    className="map-experiencedetails"
                                >
                                    <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
                                    />
                                    <Marker position={coordinates}>
                                        <Popup>{experience.location}</Popup>
                                    </Marker>
                                </MapContainer>
                            ) : (
                                <p className="map-loading-experiencedetails">Loading map...</p>
                            )}
                        </div>
                        <button className="manage-btn" onClick={handleManageExperience}>Manage Experience</button>
                    </div>
                </div>
            </div>
        </NavWineMaker>
    );
};

export default ExperienceDetails;