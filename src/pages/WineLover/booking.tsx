import React, { useEffect, useState } from 'react';
import { Experience } from '../../models/experienceModel';
import UserService from '../../services/userService';
import experienceService from '../../services/experienceService';
import '../../styles/booking.css'; 
import NavWineLover from '../../components/NavWineLover';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar'; // Asegúrate de instalar react-calendar

const ExperienceCard: React.FC<{ experience: Experience; onRateClick: (experienceId: string) => void, onShowReviewsClick: (experienceId: string) => void }> = ({ experience, onRateClick, onShowReviewsClick }) => {

    const navigate = useNavigate();
    const handleChat = (experienceTitle: string) => {
        const roomName = encodeURIComponent(experienceTitle);
        localStorage.setItem('currentRoom', roomName);
        navigate(`/chatWL/${roomName}`);
    };

    const handleRateClick = () => {
        if (experience._id) {
            onRateClick(experience._id);
        } else {
            console.error("Experience ID is undefined");
        }
    };

    const handleShowReviewsClick = () => {
        if (experience._id) {
            onShowReviewsClick(experience._id); 
        } else {
            console.error("Experience ID is undefined");
        }
    };

    return (
        <div className="experience-card">
            <div className="experience-info">
                <h3>{experience.title}</h3>
                <p className="experience-location">{experience.location}</p>
                <p className="experience-date">{experience.date}</p>
                <p className="experience-description">{experience.description}</p>
                <p className="experience-rating">Rating: {experience.averageRating} ★</p>
                <div className="experience-actions">
                    <button className="share-button" onClick={handleShowReviewsClick}>Ver Reviews</button>
                    <button className="rate-button" onClick={handleRateClick}>Valorar experiencia</button>
                    <button className="chat-button" onClick={() => handleChat(experience.title)}>Chat</button>
                </div>
            </div>
        </div>
    );
};

const Booking: React.FC = () => {
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedDateExperiences, setSelectedDateExperiences] = useState<Experience[]>([]);

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

    const getExperienceDates = () => {
        return experiences.map((experience) => new Date(experience.date));
    };

    const handleDayClick = (date: Date) => {
        const selectedExperiences = experiences.filter((experience) => {
            const expDate = new Date(experience.date);
            return (
                expDate.getFullYear() === date.getFullYear() &&
                expDate.getMonth() === date.getMonth() &&
                expDate.getDate() === date.getDate()
            );
        });
        setSelectedDateExperiences(selectedExperiences);
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

                <div className="calendar-container">
                    <h2>My experience calendar</h2>
                    <Calendar
                        onChange={(date) => console.log(date)} 
                        value={new Date()}
                        tileClassName={({ date }) => {
                            const experienceDates = getExperienceDates();
                            return experienceDates.some(
                                (expDate) =>
                                    expDate.getFullYear() === date.getFullYear() &&
                                    expDate.getMonth() === date.getMonth() &&
                                    expDate.getDate() === date.getDate()
                            )
                                ? 'highlighted-date'
                                : '';
                        }}
                        onClickDay={handleDayClick}
                    />
                </div>

                {selectedDateExperiences.length > 0 && (
                    <div className="calendar-experiences">
                        <h3>Experiences on this day:</h3>
                        <ul>
                            {selectedDateExperiences.map((experience) => (
                                <li key={experience._id}>
                                    <strong>{experience.title}</strong> - {experience.description}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="experience-list">
                    {experiences.map((experience) => (
                        <ExperienceCard 
                            key={experience._id} 
                            experience={experience} 
                            onRateClick={() => {}}
                            onShowReviewsClick={() => {}} 
                        />
                    ))}
                </div>
            </div>
        </NavWineLover>
    );
};

export default Booking;
