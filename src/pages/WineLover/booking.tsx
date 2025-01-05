import React, { useEffect, useState } from 'react';
import { Experience } from '../../models/experienceModel';
import UserService from '../../services/userService';
import '../../styles/booking.css'; // Archivo CSS para estilos
import NavWineLover from '../../components/NavWineLover'; // Asegúrate de que la ruta sea correcta
import { useNavigate } from 'react-router-dom';

// Componente de tarjeta individual para experiencias
const ExperienceCard: React.FC<{ experience: Experience }> = ({ experience }) => {
    const navigate = useNavigate();
    const handleChat = (experienceTitle: string) => {
        const roomName = encodeURIComponent(experienceTitle); // Codifica el nombre de la sala
        localStorage.setItem('currentRoom', roomName); // Guarda la sala en localStorage
        navigate(`/chatWL/${roomName}`); // Redirige a la página del chat
    };

    return (
        <div className="experience-card" style={{ height: 300 }}>
            {/* <img src={`/images/${experience._id}.jpg`} alt={experience.title} className="experience-image" /> */}
            <div className="experience-info">
                <h3>{experience.title}</h3>
                <p className="experience-location">{experience.location}</p>
                <p className="experience-date">{experience.date}</p>
                <p className="experience-description">{experience.description}</p>
                <p className="experience-rating">Rating: {experience.rating} ★</p>
                <div className="experience-actions">
                    <button className="share-button">Take me there!</button>
                    <button
                        className="chat-button"
                        onClick={() => handleChat(experience.title)}
                    >
                        Chat
                    </button>
                </div>
            </div>
        </div>
    );
};

const Booking: React.FC = () => {
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
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
                        <ExperienceCard key={experience._id} experience={experience} />
                    ))}
                </div>
            </div>
        </NavWineLover>
    );
};

export default Booking;
