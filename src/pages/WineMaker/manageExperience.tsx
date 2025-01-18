import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../styles/home.css'; // Usamos los mismos estilos que Home
import NavWineMaker from '../../components/NavWineMaker';
import experienceService from '../../services/experienceService';
import userService from '../../services/userService'; // Importamos el userService
import createBackground from '../../assets/vinito.png';
import { Service } from '../../models/serviceModel';
import { Experience } from '../../models/experienceModel';

const servicesOptions: Service[] = [
    { icon: "🍷", label: "Wine tastings" },
    { icon: "🍴", label: "Restaurant" },
    { icon: "🅿", label: "Parking" },
    { icon: "🌿", label: "Vineyard tours" },
    { icon: "🏛", label: "Winery tours" },
    { icon: "🐾", label: "Pet friendly" },
];

const EditExperience: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [formData, setFormData] = useState<Experience | null>(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchExperience = async () => {
            try {
                const experience = await experienceService.getExperienceById(id!);
                setFormData(experience);
            } catch (err) {
                setError('Failed to fetch experience');
            }
        };
        fetchExperience();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (formData) {
            setFormData((prev) => ({
                ...prev!,
                [name]: value,
            }));
        }
    };

    const handleServiceChange = (service: Service) => {
        if (formData) {
            setFormData((prev) => ({
                ...prev!,
                services: prev!.services.some((s) => s.label === service.label)
                    ? prev!.services.filter((s) => s.label !== service.label)
                    : [...prev!.services, service],
            }));
        }
    };

    const handleParticipantRemove = async (participantId: string) => {
        if (formData) {
            try {
                // Primero eliminar al participante de la experiencia en el backend
                await experienceService.removeUserFromExperience(id!, participantId);
                
                // Luego eliminar al participante de la lista en el frontend
                setFormData((prev) => ({
                    ...prev!,
                    participants: prev!.participants.filter((p) => p !== participantId),
                }));

                // Además, llamar a la función de userService para eliminar la experiencia del usuario
                await userService.removeExperienceFromUser(id!, participantId);

            } catch (err) {
                setError('Failed to remove participant');
            }
        }
    };

    const handleCommentRemove = async (commentId: string) => {
        if (formData) {
            try {
                await experienceService.removeCommentFromExperience(id!, commentId);
                setFormData((prev) => ({
                    ...prev!,
                    reviews: prev!.reviews.filter((r) => r.id !== commentId),
                }));
            } catch (err) {
                setError('Failed to remove comment');
            }
        }
    };

    const handleSubmit = async () => {
        if (!formData) return;

        try {
            await experienceService.updateExperience(id!, formData);
            navigate('/homeWineMaker');
        } catch (err) {
            setError('Failed to update experience');
        }
    };

    if (!formData) {
        return <div>Loading...</div>;
    }

    return (
        <NavWineMaker>
            <div className="home-container">
                <div
                    className="top-plans"
                    style={{ backgroundImage: `url(${createBackground})` }}
                >
                    <div className="top-plans-content">
                        <h1>Edit</h1>
                        <h2>WineMaker Experience</h2>
                    </div>
                </div>

                {error && <div className="error-message">{error}</div>}

                <div className="form-create-experience">
                    <label style={{ fontWeight: 'bold', color: 'white' }} htmlFor="title">Title</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                    />

                    {/* Similar structure for other fields like description, price, location, etc. */}

                    <label style={{ fontWeight: 'bold', color: 'white' }} className="label-create">Services</label>
                    <div className="services-container-create">
                        {servicesOptions.map((service) => (
                            <div key={service.label} className="service-checkbox-create">
                                <label className="service-label-create">
                                    <input
                                        type="checkbox"
                                        checked={formData.services.some((s) => s.label === service.label)}
                                        onChange={() => handleServiceChange(service)}
                                    />
                                    <span className="service-icon-create">{service.icon}</span>
                                    {service.label}
                                </label>
                            </div>
                        ))}
                    </div>

                    <h3>Participants</h3>
                    <ul>
                        {formData.participants.map((participant) => (
                            <li key={participant}>
                                {participant}{" "}
                                <button onClick={() => handleParticipantRemove(participant)}>Remove</button>
                            </li>
                        ))}
                    </ul>

                    <h3>Comments</h3>
                    <ul>
                        {formData.reviews.map((review) => (
                            <li key={review.id}>
                                <strong>{review.user}: </strong>{review.comment}{" "}
                                <button onClick={() => handleCommentRemove(review.id)}>Remove</button>
                            </li>
                        ))}
                    </ul>

                    <button className="create-btn" onClick={handleSubmit}>
                        Save Changes
                    </button>
                </div>
            </div>
        </NavWineMaker>
    );
};

export default EditExperience;
