import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import wineService from '../../services/wineService';
import experienceService from '../../services/experienceService';
import '../../styles/listwine.css';
import NavWineMaker from '../../components/NavWineMaker';
import defaultWineImage from '../../assets/winebottleint.png';

const ListWines: React.FC = () => {
    const [wines, setWines] = useState<any[]>([]);
    const [experienceData, setExperienceData] = useState<{ [key: string]: any }>({});
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchWines = async () => {
            try {
                const ownerId = localStorage.getItem('id'); // Asegúrate de que userId se almacene al iniciar sesión
                if (!ownerId) {
                    throw new Error('Owner ID not found');
                }

                const response = await wineService.getWinesByOwner(ownerId);
                if (Array.isArray(response)) {
                    setWines(response);

                    // Cargar los datos de las experiencias asociadas
                    const experiencePromises = response.map((wine) =>
                        wine.experience ? experienceService.getExperienceById(wine.experience) : null
                    );
                    const experiences = await Promise.all(experiencePromises);
                    const experiencesMap = experiences.reduce((acc, exp) => {
                        if (exp && exp._id) {
                            acc[exp._id] = exp;
                        }
                        return acc;
                    }, {} as Record<string, any>);
                    setExperienceData(experiencesMap);
                } else {
                    setWines([]); // Si no hay vinos, establece un array vacío
                }
            } catch (err) {
                console.error('Error fetching wines:', err);
                setError('network');
            }
        };

        fetchWines();
    }, []);

    const handleExperienceClick = (experienceId: string) => {
        navigate(`/experienceWM/${experienceId}`);
    };

    if (error) {
        return <p className="error-message">{error}</p>;
    }

    if (error === 'network') {
        return <p className="error-message">Failed to fetch wines</p>;
    }

    if (wines.length === 0) {
        return (
            <NavWineMaker>
                <div className="no-wines-container">
                    <p className="no-wines-message">You don't own wines yet, add your first wine!</p>
                    <button
                        className="create-wine-button"
                        onClick={() => navigate('/createWine')}
                    >
                        Create Wine
                    </button>
                </div>
            </NavWineMaker>
        );
    }

    return (
        <NavWineMaker>

            <div className="listwines-container">
                <h1 className="listwines-title">Your Wines</h1>
                <div className="wine-list">
                    {wines.length > 0 ? (
                        wines.map((wine) => (
                            <div key={wine._id} className="wine-card-list">
                                <img
                                    src={wine.image || defaultWineImage}
                                    alt={wine.name}
                                    className="wine-card-image-list"
                                />
                                <div className="wine-details-list">
                                    <h3>{wine.name}</h3>
                                    <p><strong>Price:</strong> €{wine.price}</p>
                                    <p><strong>Color:</strong> {wine.color}</p>
                                    <p><strong>Brand:</strong> {wine.brand}</p>
                                    <p><strong>Grape Type:</strong> {wine.grapetype}</p>
                                    <p><strong>Year:</strong> {wine.year}</p>
                                </div>
                                {wine.experience && (
                                    <div className="wine-experience-card-list">
                                        <div
                                            className="experience-card-list"
                                            onClick={() => handleExperienceClick(wine.experience)}
                                        >
                                            <h4>
                                                Experience: {experienceData[wine.experience]?.title || 'Unknown'}
                                            </h4>
                                            <p>
                                                {experienceData[wine.experience]?.description || 'No description available'}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="no-data-message">You have no wines yet</p>
                    )}
                </div>
            </div>
        </NavWineMaker>
    );
};

export default ListWines;
