import React, { useEffect, useState } from 'react';
import { Experience } from '../../models/experienceModel';
import UserService from '../../services/userService';
import experienceService from '../../services/experienceService';
import '../../styles/booking.css';
import NavWineLover from '../../components/NavWineLover';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar'; // Asegúrate de instalar react-calendar
import { useBadWords } from '../../utils/badWordsContext';  // Importa el hook useBadWords

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
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [rating, setRating] = useState<number>(0);
    const [comment, setComment] = useState<string>(""); // Nuevo estado para comentarios
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [showReviewsModal, setShowReviewsModal] = useState(false); // Estado para controlar el modal de reseñas
    const [selectedReviews, setSelectedReviews] = useState<any[]>([]); // Estado para almacenar las reseñas seleccionadas
    const [selectedExperience, setSelectedExperience] = useState<string | null>(null);
    const { cleanText, containsBadWords } = useBadWords();  // Usa el hook para acceder a las funciones del contexto

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
        setRating(0);
        setComment(""); // Limpiar comentario al cerrar el modal
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

    const handleRatingSubmit = async () => {
        if (selectedExperience && rating > 0 && comment.trim() !== "") {
            const cleanedComment = cleanText(comment);  // Filtra las malas palabras del comentario
            if (containsBadWords(cleanedComment)) {
                setErrorMessage("Your comment contains inappropriate language. Please edit your comment.");
                setShowErrorModal(true);  // Muestra el modal de error
                return;
            }
            try {
                console.log(`Submitting rating: ${rating} with comment: "${comment}" for experience: ${selectedExperience}`);
                
                // Añadir la valoración y el comentario
                await experienceService.añadirValoracion(selectedExperience, rating, cleanedComment);  // Usar el comentario limpio

                // Obtener la experiencia actualizada
                const updatedExperience = await experienceService.getExperienceById(selectedExperience);

                // Actualizar la lista de experiencias en el estado local
                setExperiences((prevExperiences) =>
                    prevExperiences.map((exp) =>
                        exp._id === selectedExperience ? updatedExperience : exp
                    )
                );

                handleCloseModal(); // Cerrar el modal después de la valoración
            } catch (err) {
                if (err instanceof AxiosError && err.response) {
                    if (err.response.status === 400) {
                        setErrorMessage("You have already rated this experience!");
                        setShowErrorModal(true); // Muestra el modal de error
                    }
                } else {
                    console.error("Error rating experience:", err);
                }

                handleCloseModal(); // Cerrar el modal después de error
            }
        } else {
            alert("Please provide both a rating and a comment.");
        }
    };

    const handleShowReviewsClick = async (experienceId: string) => {
        try {
            const reviews = await experienceService.getExperienceRatings(experienceId);  // Ahora esto devuelve un array de objetos Review
            const reviewsWithUsernames = await Promise.all(reviews.map(async (review) => {
                const user = await UserService.getUserById(review.user); // Obtener el usuario por ID
                return { ...review, username: user.username }; // Añadir el username al review
            }));
            setSelectedReviews(reviewsWithUsernames);  // Almacena las reseñas en el estado
            setShowReviewsModal(true);    // Muestra el modal con las reseñas
        } catch (err) {
            console.error("Error fetching reviews:", err);
        }
    };


    const handleCloseReviewsModal = () => {
        setShowReviewsModal(false);
        setSelectedReviews([]); // Limpiar las reseñas al cerrar el modal
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
                        <ExperienceCard key={experience._id} experience={experience} onRateClick={handleRateClick} onShowReviewsClick={handleShowReviewsClick} />
                    ))}
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
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Leave a comment"
                                    rows={4}
                                />
                            </div>
                            <div>
                                <button onClick={handleRatingSubmit}>Submit</button>
                                <button onClick={handleCloseModal}>Cancel</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal de error */}
                {showErrorModal && (
                    <div className="modal">
                        <div className="modal-content">
                            <h3>Error</h3>
                            <p>{errorMessage}</p>
                            <div>
                                <button onClick={() => setShowErrorModal(false)}>Close</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal para mostrar las reseñas */}
                {showReviewsModal && selectedReviews.length > 0 && (
                    <div className="modal">
                        <div className="modal-content">
                            <h3>Reviews for this experience</h3>
                            <ul>
                                {selectedReviews.map((review, index) => (
                                    <div key={review._id}>
                                        <li>
                                            <p><strong>User:</strong> {review.username}</p>
                                            <p><strong>Rating:</strong> {review.value} ★</p>
                                            <p><strong>Comment:</strong> {review.comment}</p>
                                        </li>
                                        {/* Línea horizontal para separar las valoraciones */}
                                        {index < selectedReviews.length - 1 && <hr />}
                                    </div>
                                ))}
                            </ul>
                            <div>
                                <button onClick={handleCloseReviewsModal}>Close</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

        </NavWineLover>
    );
};

export default Booking;
