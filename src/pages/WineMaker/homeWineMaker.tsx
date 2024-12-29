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
import NavWineMaker from '../../components/NavWineMaker'; // Asegúrate de que la ruta sea correcta

const Home: React.FC = () => {
    const navigate = useNavigate();
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchExperiences = async () => {
            try {
                const data = await experienceService.getAllExperiences();
                setExperiences(data);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('An unexpected error occurred');
                }
            }
        };

        fetchExperiences();
    }, []);

    const handleCardClick = (id: string) => {
        navigate(`/experienceWM/${id}`); // Redirige al usuario a la página de detalles
    };

    return (
        <NavWineMaker>
            {/* Todo el contenido de la página Home va como children */}
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

                <div className="experience-list">
                    {experiences.map((experience) => (
                        <div
                            className="experience-card"
                            key={experience._id}
                            onClick={() => handleCardClick(experience._id || '')} // Hace la card clickeable
                            style={{ cursor: 'pointer' }}
                        >
                            <img
                                src={expImg}
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
            </div>
        </NavWineMaker>
    );
};

export default Home;
