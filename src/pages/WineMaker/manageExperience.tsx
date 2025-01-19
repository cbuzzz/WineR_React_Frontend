import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../styles/createwine.css';
import NavWineMaker from '../../components/NavWineMaker';
import experienceService from '../../services/experienceService';
import createBackground from '../../assets/vinito.png';
import { Service } from '../../models/serviceModel';
import { Experience } from '../../models/experienceModel';
import { Wine } from '../../models/wineModel';
import userService from '../../services/userService';
import wineService from '../../services/wineService';
import exp from 'constants';

const servicesOptions: Service[] = [
    { icon: "🍷", label: "Wine tastings" },
    { icon: "🍴", label: "Restaurant" },
    { icon: "🅿️", label: "Parking" },
    { icon: "🌿", label: "Vineyard tours" },
    { icon: "🏛", label: "Winery tours" },
    { icon: "🐾", label: "Pet friendly" },
];

const CreateExperience: React.FC = () => {
    const [formData, setFormData] = useState<Experience>({
        title: '',
        description: '',
        price: 0,
        location: '',
        contactnumber: 0,
        contactmail: '',
        date: '',
        owner: '',
        participants: [],
        averageRating: 0,
        reviews: [],
        services: [], // Aquí se almacenarán los servicios seleccionados
        image: '', // Añadimos un campo para las imágenes
        wines: [],
    });
    const { id } = useParams<{ id: string }>();
    const [experience, setExperience] = useState<Experience | null>(null);
    const [wine, setWine] = useState<Wine | null>(null);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | undefined>(createBackground);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false); // Estado para el modal de éxito
    const [deleteModal, setDeleteModal] = useState(false);
    const [usernames, setUsernames] = useState<{ [key: string]: string }>({}); // Almacena los usernames
    const navigate = useNavigate();

    // Hook para obtener el ID del propietario desde el localStorage
    useEffect(() => {
        const userId = localStorage.getItem('id');
        if (userId) {
            setFormData((prevData) => ({
                ...prevData,
                owner: userId, // Asignamos el ID del usuario al campo owner
            }));
        } else {
            setError('User ID not found in localStorage');
        }
        const fetchExperience = async () => {
            try {
                const experience = await experienceService.getExperienceById(id!);
                setFormData(experience);
                setExperience(experience);

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
    }, [id]); // Solo ejecuta este efecto una vez cuando el componente se monta

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleParticipantRemove = async (participantId: string) => {
        if (formData) {
            try {
                await experienceService.removeUserFromExperience(id!, participantId);
                setFormData((prev) => ({
                    ...prev!,
                    participants: prev!.participants.filter((p) => p !== participantId),
                }));
                await userService.removeExperienceFromUser(id!, participantId);
            } catch (err) {
                setError('Failed to remove participant');
            }
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setSelectedImage(file);
        if (file) {
            setPreviewImage(URL.createObjectURL(file));
        } else {
            setPreviewImage(createBackground);
        }
    };

    const handleServiceChange = (service: Service) => {
        setFormData((prev) => ({
            ...prev,
            services: prev.services.some((s) => s.label === service.label)
                ? prev.services.filter((s) => s.label !== service.label)
                : [...prev.services, service],
        }));
    };

    const handleSubmit = async () => {
        setError('');
        setShowModal(false); // Asegurarnos de que el modal esté oculto al inicio del envío

        try {
            const updateExperience = await experienceService.updateExperience(id!, formData);

            // Subir imagen si se seleccionó
            if (updateExperience._id && selectedImage) {
                setShowModal(true); // Mostrar el modal de éxito
                const imageFormData = new FormData();
                imageFormData.append('image', selectedImage);
                // Llamar al servicio de subida de imágenes
                await experienceService.uploadExperienceImage(updateExperience._id, imageFormData);
            }
            else {
                setShowModal(true); // Mostrar el modal de éxito
            }
            // Redirigir después de un corto periodo de tiempo (3 segundos)
            setTimeout(() => {
                setShowModal(false); // Cerrar el modal
                navigate('/homeWineMaker'); // Redirigir al homeWineMaker
            }, 2000); // 2 segundos de espera antes de la redirección
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unexpected error occurred');
            }
        }
    };

    const handleDelete = async () => {
        setError('');
        setDeleteModal(false); // Asegurarnos de que el modal esté oculto al inicio del envío

        try {
            const ownerid = localStorage.getItem('id');
            // const expwine = await wineService.getWineById(experience?.wines[0]!);
            // const defaultWine: Wine = {
            //     owner: expwine.owner, // Cambiar por un valor específico o dejar como string por defecto
            //     name: expwine.name,
            //     price: expwine.price, // Precio inicial por defecto
            //     color: expwine.color, // Cambiar por un color predeterminado, ej. 'Red', 'White'
            //     brand: expwine.brand,
            //     grapetype: expwine.grapetype,
            //     habilitado: expwine.habilitado, // Por defecto habilitado
            //     notes: expwine.notes, // Array vacío de notas
            //     year: expwine.year, // Año actual como valor por defecto
            //     experience: "",
            //     image: expwine.image, // Ruta o nombre de imagen por defecto
            // };
            await userService.removeExperienceFromUser(id!, ownerid!);
            await experienceService.deleteExperience(id!);
            // await wineService.updateWine(experience?.wines[0]!, defaultWine);
            setDeleteModal(true); // Mostrar el modal de éxito
            // Redirigir después de un corto periodo de tiempo (3 segundos)
            setTimeout(() => {
                setDeleteModal(false); // Cerrar el modal
                navigate('/homeWineMaker'); // Redirigir al homeWineMaker
            }, 2000); // 2 segundos de espera antes de la redirección
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unexpected error occurred');
            }
        }
    };

    return (
        <NavWineMaker>
            <div className="createexp-top-content">
                <h1 className="createexp-title">Update Experience</h1>
            </div>

            {error && <div className="createexp-error-message">{error}</div>}
            <div className="createexp-two-column-layout">
                <div className="createexp-left-column">
                    <img
                        src={experience?.image || previewImage || createBackground}
                        alt="Experience"
                        className="createexp-image-preview"
                    />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="createexp-image-input"
                    />

                    <label style={{ fontWeight: 'bold', color: 'white' }} className="createexp-label">Services</label>
                    <div className="createexp-services-container">
                        {servicesOptions.map((service) => (
                            <div key={service.label} className="notes-checkbox-create"> {/* Cambia la clase aquí */}
                                <label className="notes-label-create"> {/* Cambia la clase aquí */}
                                    <input
                                        type="checkbox"
                                        checked={formData.services.some((s) => s.label === service.label)}
                                        onChange={() => handleServiceChange(service)}
                                    />
                                    <span className="notes-icon-create">{service.icon}</span> {/* Cambia la clase aquí */}
                                    {service.label}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="createexp-right-column">
                    <div className="form-create-wine">
                        <label style={{ fontWeight: 'bold', color: 'white' }} htmlFor="title" className="createexp-label">Title</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            placeholder="Enter experience title"
                            value={formData.title}
                            onChange={handleChange}
                            className="createexp-input"
                        />

                        <label style={{ fontWeight: 'bold', color: 'white' }} htmlFor="description" className="createexp-label">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            placeholder="Enter description"
                            rows={4}
                            value={formData.description}
                            onChange={handleChange}
                            className="createexp-textarea"
                        />

                        <label style={{ fontWeight: 'bold', color: 'white' }} htmlFor="price" className="createexp-label">Price (€)</label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            placeholder="Enter price"
                            value={formData.price}
                            onChange={handleChange}
                            className="createexp-input"
                        />

                        <label style={{ fontWeight: 'bold', color: 'white' }} htmlFor="contactnumber">Contact Number</label>
                        <input
                            type="tel"
                            id="contactnumber"
                            name="contactnumber"
                            placeholder="Enter the contact number"
                            value={formData.contactnumber}
                            onChange={handleChange}
                        />

                        <label style={{ fontWeight: 'bold', color: 'white' }} htmlFor="contactmail">Contact Email</label>
                        <input
                            type="email"
                            id="contactmail"
                            name="contactmail"
                            placeholder="Enter the contact email"
                            value={formData.contactmail}
                            onChange={handleChange}
                        />

                        <label style={{ fontWeight: 'bold', color: 'white' }} htmlFor="location" className="createexp-label">Location</label>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            placeholder="Enter location"
                            value={formData.location}
                            onChange={handleChange}
                            className="createexp-input"
                        />

                        <label style={{ fontWeight: 'bold', color: 'white' }} htmlFor="date" className="createexp-label">Date</label>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            className="createexp-input"
                        />
                        <h3 className="createexp-participants-title">Participants</h3>
                        <ul className="createexp-participants-list">
                            {formData.participants.map((participant) => (
                                <li key={participant} className="createexp-participant-item">
                                    {usernames[participant] || participant}
                                    <button
                                        className="createexp-remove-participant-btn"
                                        onClick={() => handleParticipantRemove(participant)}
                                    >
                                        Remove
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <button className="createexp-btn" onClick={handleSubmit}>
                        Update Experience
                    </button>
                    <button className="createexp-btn" onClick={handleDelete}>
                        Delete Experience
                    </button>
                </div>
            </div>

            {showModal && (
                <div className="createexp-modal">
                    <div className="createexp-modal-content">
                        <h3>Experience is being updated. Redirecting...</h3>
                    </div>
                </div>
            )}
            {deleteModal && (
                <div className="createexp-modal">
                    <div className="createexp-modal-content">
                        <h3>Experience is being deleted. Redirecting...</h3>
                    </div>
                </div>
            )}
        </NavWineMaker>
    );
};

export default CreateExperience;
