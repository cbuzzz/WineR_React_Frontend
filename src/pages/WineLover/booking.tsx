import React, { useEffect, useState } from 'react';
import { Experience } from '../../models/experienceModel';
import UserService from '../../services/userService';
import experienceService from '../../services/experienceService'; // Importa el servicio que contiene `añadirValoracion`
import '../../styles/booking.css'; // Archivo CSS para estilos
import NavWineLover from '../../components/NavWineLover'; // Asegúrate de que la ruta sea correcta

// Componente de tarjeta individual para experiencias
const ExperienceCard: React.FC<{ experience: Experience; onRateClick: (experienceId: string) => void }> = ({ experience, onRateClick }) => {
    const handleRateClick = () => {
        if (experience._id) {
            onRateClick(experience._id);
        } else {
            console.error("Experience ID is undefined");
        }
    };

    return (
        <div className="experience-card" style={{ height: 300 }}>
            <div className="experience-info">
                <h3>{experience.title}</h3>
                <p className="experience-location">{experience.location}</p>
                <p className="experience-date">{experience.date}</p>
                <p className="experience-description">{experience.description}</p>
                <p className="experience-rating">Rating: {experience.averagerating} ★</p>
                <button className="share-button">Take me there!</button>
                <button className="rate-button" onClick={handleRateClick}>
                    Rate the experience
                </button>
            </div>
        </div>
    );
};


const Booking: React.FC = () => {
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [selectedExperience, setSelectedExperience] = useState<string | null>(null);
    const [rating, setRating] = useState<number>(0);

    useEffect(() => {
        const fetchExperiences = async () => {
            try {
                const userExperiences = await UserService.fetchUserExperiences();
                setExperiences(userExperiences);
            } catch (err) {
                setError('Failed to fetch experiences');
            } finally {
                setLoading(false);
            }
        };

        fetchExperiences();
    }, []);

    const handleRateClick = (experienceId: string) => {
        if (experienceId) {
            setSelectedExperience(experienceId);
            setShowRatingModal(true); // Muestra el modal para calificar
        }
    };

    const handleCloseModal = () => {
        setShowRatingModal(false);
        setSelectedExperience(null);
    };

    const handleRatingSubmit = async () => {
        if (selectedExperience && rating > 0) {
            try {
                console.log(rating)
                await experienceService.añadirValoracion(selectedExperience, rating);
                handleCloseModal(); // Cerrar el modal después de la valoración
            } catch (err) {
                console.error("Error rating experience:", err);
            }
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p className="error-message">{error}</p>;
    }

    return (
        <NavWineLover>
            <div className="booking-container">
                <header className="booking-header">
                    <h1>Upcoming Bookings</h1>
                    <div className="booking-actions">
                        <input type="text" placeholder="Search..." className="search-bar1" />
                        <button className="filter-button">Filters</button>
                    </div>
                </header>
                <div className="experience-list">
                    {experiences.map((experience) => (
                        <ExperienceCard key={experience._id} experience={experience} onRateClick={handleRateClick} />
                    ))}
                </div>
            </div>

            {/* Modal para valorar experiencia */}
            {showRatingModal && selectedExperience && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Rate this experience</h3>
                        <div>
                            <input
                                type="number"
                                value={rating}
                                onChange={(e) => setRating(Number(e.target.value))}
                                min={1}
                                max={5}
                                placeholder="Rating (1-5)"
                            />
                        </div>
                        <div>
                            <button onClick={handleRatingSubmit}>Submit Rating</button>
                            <button onClick={handleCloseModal}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </NavWineLover>
    );
};

export default Booking;
