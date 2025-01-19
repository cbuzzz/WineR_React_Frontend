import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/home.css';
import topPlansBackground from '../../assets/top-plans-background.jpg';
import expImg from '../../assets/exp.jpg';
import starIcon from '../../assets/star.png';
import wineIcon from '../../assets/wine.png';
import ubiIcon from '../../assets/ubi.png';
import dateIcon from '../../assets/date.png';
import experienceService from '../../services/experienceService';
import { Experience } from '../../models/experienceModel';
import NavWineMaker from '../../components/NavWineMaker';
import userService from '../../services/userService';
import Calendar from 'react-calendar'; // Asegúrate de instalar react-calendar

const Home: React.FC = () => {
    const navigate = useNavigate();
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [selectedDateExperiences, setSelectedDateExperiences] = useState<Experience[]>([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    const id = localStorage.getItem('id');

    useEffect(() => {
        if (!id) {
            setError('User not found');
            setLoading(false);
            return;
        }

        const fetchExperiences = async () => {
            try {
                const data = await userService.getUserExperiences(); // Asegúrate de que filtre solo las experiencias del usuario
                setExperiences(data);
                setLoading(false);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('An unexpected error occurred');
                }
                setLoading(false);
            }
        };

        fetchExperiences();
    }, [id]);

    const handleCardClick = (id: string) => {
        navigate(`/experienceWM/${id}`);
    };

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

    return (
        <NavWineMaker>
            <div className="home-container">
                <div
                    className="top-plans"
                    style={{ backgroundImage: `url(${topPlansBackground})` }}
                >
                    <div className="top-plans-content">
                        <h1>Welcome</h1>
                        <h2>WineMaker</h2>
                        <p>Create Unique Experiences</p>
                        <button className="see-more-btn">See more</button>
                    </div>
                </div>

                {error && <div className="error-message">{error}</div>}

                {loading ? (
                    <div className="loading-message">Loading experiences...</div>
                ) : (
                    <div className="calendar-container">
                        <h2>My Experience Calendar</h2>
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
                )}

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

                {!loading && experiences.length > 0 && (
                    <div className="experience-list">
                        {experiences.map((experience) => (
                            <div
                                className="experience-card"
                                key={experience._id}
                                onClick={() => handleCardClick(experience._id || '')}
                                style={{ cursor: 'pointer' }}
                            >
                                <img
                                    src={experience.image ? experience.image : expImg}
                                    alt={experience.title}
                                    className="experience-image"
                                />
                                <div className="experience-info">
                                    <div className="experience-name">
                                        <img
                                            src={wineIcon}
                                            alt="Wine bottle"
                                            style={{ width: '20px', height: 'auto' }}
                                            className="icon-wine"
                                        />
                                        {experience.title}
                                    </div>
                                    <div className="experience-location">
                                        <img
                                            src={ubiIcon}
                                            alt="Location"
                                            style={{ width: '15px', height: 'auto' }}
                                            className="icon-ubi"
                                        />
                                        {experience.location} {experience.price}
                                    </div>
                                    <div className="experience-date">
                                        <img
                                            src={dateIcon}
                                            alt="Date"
                                            style={{ width: '15px', height: 'auto' }}
                                            className="date-ubi"
                                        />
                                        {experience.date}
                                    </div>
                                    <div className="experience-description">
                                        {experience.description}
                                    </div>
                                    <div className="experience-rating">
                                        <img
                                            src={starIcon}
                                            alt="Rating"
                                            style={{ width: '20px', height: '20px' }}
                                            className="icon-star"
                                        />
                                        {experience.averageRating}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </NavWineMaker>
    );
};

export default Home;
