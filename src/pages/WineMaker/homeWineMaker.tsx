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
import userService from '../../services/userService';

const Home: React.FC = () => {
    const navigate = useNavigate();
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true); // Estado de carga

    // Obtener el id del usuario desde localStorage
    const id = localStorage.getItem('id');

    useEffect(() => {
        if (!id) {
            setError('User not found');
            setLoading(false); // Detener carga si no se encuentra el id
            return;
        }

        const fetchExperiences = async () => {
            try {
                const data = await userService.getUserExperiences(); // Pasar el id al servicio
                setExperiences(data);
                setLoading(false); // Detener carga al recibir los datos
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('An unexpected error occurred');
                }
                setLoading(false); // Detener carga incluso si hay error
            }
        };

        fetchExperiences();
    }, [id]); // Rehacer la petición si el id cambia (en caso de que se cambie el usuario)

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
                
                {loading ? ( // Mostrar mensaje de carga
                    <div className="loading-message">Loading experiences...</div>
                ) : (
                    <div className="experience-list">
                        {experiences.length === 0 ? (
                            <div className="no-experiences-message">No experiences found.</div> // Mensaje si no hay experiencias
                        ) : (
                            experiences.map((experience) => (
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
                            ))
                        )}
                    </div>
                )}
            </div>
        </NavWineMaker>
    );
};

export default Home;
