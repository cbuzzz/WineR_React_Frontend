import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../styles/home.css';
import NavWineMaker from '../../components/NavWineMaker';
import experienceService from '../../services/experienceService';
import userService from '../../services/userService';  // Importa tu userService
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
    const [usernames, setUsernames] = useState<{ [key: string]: string }>({}); // Almacena los usernames
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchExperience = async () => {
            try {
                const experience = await experienceService.getExperienceById(id!);
                setFormData(experience);

                // Obtener los usernames de los participantes
                const usernamesPromises = experience.participants.map(async (participantId) => {
                    const user = await userService.getUserById(participantId);  // Usamos tu función getUserById
                    return { [participantId]: user.username };  // Asumimos que user.username existe
                });
                const usernamesData = await Promise.all(usernamesPromises);
                
                // Actualiza los usernames
                setUsernames(usernamesData.reduce((acc, curr) => ({ ...acc, ...curr }), {}));
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
                await experienceService.removeUserFromExperience(id!, participantId);
                setFormData((prev) => ( {
                    ...prev!,
                    participants: prev!.participants.filter((p) => p !== participantId),
                }));
                await userService.removeExperienceFromUser(id!, participantId);
            } catch (err) {
                setError('Failed to remove participant');
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
                <div className="top-plans" style={{ backgroundImage: `url(${createBackground})` }}>
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

                    <label style={{ fontWeight: 'bold', color: 'white' }} htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description || ''}
                        onChange={handleChange}
                    />

                    <label style={{ fontWeight: 'bold', color: 'white' }} htmlFor="location">Location</label>
                    <input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                    />

                    <label style={{ fontWeight: 'bold', color: 'white' }} htmlFor="date">Date</label>
                    <input
                        type="date"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                    />

                    <label style={{ fontWeight: 'bold', color: 'white' }}>Services</label>
                    <div>
                        {servicesOptions.map((service) => (
                            <div key={service.label}>
                                <input
                                    type="checkbox"
                                    checked={formData.services.some((s) => s.label === service.label)}
                                    onChange={() => handleServiceChange(service)}
                                />
                                <span>{service.icon} {service.label}</span>
                            </div>
                        ))}
                    </div>

                    <h3>Participants</h3>
                    <ul>
                        {formData.participants.map((participant) => (
                            <li key={participant}>
                                {usernames[participant] || participant}{" "}
                                <button onClick={() => handleParticipantRemove(participant)}>Remove</button>
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
