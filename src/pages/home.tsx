import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/home.css';
import topPlansBackground from '../assets/top-plans-background.jpg';
import expImg from '../assets/exp.jpg';
// import wineRLogo from '../assets/winerlogo.png';
import starIcon from '../assets/star.png';
import wineIcon from '../assets/wine.png';
import ubiIcon from '../assets/ubi.png';
// import tasteIcon from '../assets/taste.png';
// import restaurantIcon from '../assets/restaurant.png';
// import parkingIcon from '../assets/parking.png';
// import uvaIcon from '../assets/uva.png';
import dateIcon from '../assets/date.png';
import experienceService from '../services/experienceService';
import { Experience } from '../models/experienceModel';

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
        navigate(`/experience/${id}`); // Redirige al usuario a la página de detalles
    };

    return (
        <div className="home-container">
            <div
                className="top-plans"
                style={{ backgroundImage: `url(${topPlansBackground})` }}
            >
                <div className="top-plans-content">
                    <h1>Welcome</h1>
                    <h2>WineLover</h2>
                    <p>Discover Unique Experiences</p>
                    <button className="see-more-btn">See more</button>
                </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="filters-container">
                <button className="filter-btn">Filter</button>
            </div>

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
                                    style={{ width: '15px', height: 'auto' }}
                                    className="icon-star"
                                />
                                {experience.rating}
                            </div>
                            {/* <div className="experience-icons">
                                <div className="icon-item">
                                    <img
                                        src={tasteIcon}
                                        alt="Wine Tastings"
                                        style={{ width: '20px', height: 'auto' }}
                                        className="icon-taste"
                                    />
                                    <span>Wine tastings</span>
                                </div>
                                <div className="icon-item">
                                    <img
                                        src={restaurantIcon}
                                        alt="Restaurant"
                                        style={{ width: '20px', height: 'auto' }}
                                        className="icon-restaurant"
                                    />
                                    <span>Restaurant</span>
                                </div>
                                <div className="icon-item">
                                    <img
                                        src={parkingIcon}
                                        alt="Parking"
                                        style={{ width: '20px', height: 'auto' }}
                                        className="icon-parking"
                                    />
                                    <span>Parking</span>
                                </div>
                                <div className="icon-item">
                                    <img
                                        src={uvaIcon}
                                        alt="Vineyard Tours"
                                        style={{ width: '20px', height: 'auto' }}
                                        className="icon-uva"
                                    />
                                    <span>Vineyard tours</span>
                                </div>
                            </div> */}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;
