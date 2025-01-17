import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import '../../styles/createwine.css';
import NavWineMaker from '../../components/NavWineMaker';
import wineService from '../../services/wineService';
import grapeTypeService from '../../services/grapeTypeService';
import experienceService from '../../services/experienceService';
import defaultWineImage from '../../assets/winebottleint.png';
import RedWineImage from '../../assets/red-wine.png';
import WhiteWineImage from '../../assets/white-wine.png';
import { Service } from '../../models/serviceModel';
import { Wine } from '../../models/wineModel';
import { Experience } from '../../models/experienceModel';
import { SingleValue } from 'react-select';

const noteOptions: Service[] = [
    { icon: "🍓", label: "Fruity" },
    { icon: "🌸", label: "Floral" },
    { icon: "🫛", label: "Vegetable" },
    { icon: "🫚", label: "Spiced" },
    { icon: "🐴", label: "Animal" },
    { icon: "🌰", label: "Toasted" },
];

const CreateWine: React.FC = () => {
    const [formData, setFormData] = useState<Wine>({
        owner: '',
        name: '',
        price: 0,
        color: '',
        brand: '',
        grapetype: '',
        habilitado: true,
        year: 2018,
        notes: [],
        experience: '',
    });

    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [grapeTypes, setGrapeTypes] = useState<{ value: string; label: string }[]>([]);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const userId = localStorage.getItem('id');
        if (userId) {
            setFormData((prevData) => ({
                ...prevData,
                owner: userId,
            }));

            const fetchExperiences = async () => {
                try {
                    const userExperiences = await experienceService.getUserExperiences(userId);
                    setExperiences(userExperiences || []); // Actualiza el estado con las experiencias
                } catch (err) {
                    console.error('Failed to fetch experiences:', err);
                }
            };
            const fetchGrapeTypes = async () => {
                try {
                    const response = await grapeTypeService.getGrapeTypes();
                    setGrapeTypes(response.map((type: { name: string; color: string }) => ({
                        value: type.name,
                        label: `${type.name} (${type.color})`,
                    })));
                } catch (err) {
                    console.error('Failed to fetch grape types:', err);
                }
            };

            fetchExperiences();
            fetchGrapeTypes();
        } else {
            setError('User ID not found in localStorage');
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result as string); // Carga la imagen seleccionada
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGrapeTypeChange = (selectedOption: SingleValue<{ value: string; label: string }>) => {
        setFormData((prev) => ({
            ...prev,
            grapetype: selectedOption ? selectedOption.value : '',
            color: selectedOption?.label.includes('(RED)') ? 'Red' : selectedOption?.label.includes('(WHITE)') ? 'White' : '', // Determina el color según el contenido del string
        }));
    };

    const handleExperienceChange = (selectedOption: SingleValue<{ value: string | undefined; label: string }>) => {
        setFormData((prev) => ({
            ...prev,
            experience: selectedOption?.value || '',
        }));
    };

    const handleNoteChange = (note: Service) => {
        setFormData((prev) => ({
            ...prev,
            notes: prev.notes.some((n) => n.label === note.label)
                ? prev.notes.filter((n) => n.label !== note.label)
                : [...prev.notes, note],
        }));
    };

    const handleSubmit = async () => {
        setError('');
        setShowModal(false);

        try {
            console.log(formData);
            await wineService.createWine(formData); // Llamar al servicio para crear el vino
            setShowModal(true); // Mostrar el modal de éxito

            // Redirigir después de 3 segundos
            setTimeout(() => {
                setShowModal(false);
                navigate('/homeWineMaker'); // Redirigir al menú principal
            }, 3000);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unexpected error occurred');
            }
        }
    };

    return (
        <NavWineMaker> {/* El contenido de la página está dentro de NavWineMaker */}

            <div className="top-plans-content">
                <h1>Add your wine to WineR</h1>
                <h2>New Wine</h2>
            </div>

            {error && <div className="error-message">{error}</div>}
            <div className="two-column-layout">
                <div className="left-column">
                    <img
                        src={selectedImage || defaultWineImage}
                        alt="Wine"
                        className="wine-image"
                    />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="image-input"
                    />

                    <label style={{ fontWeight: 'bold', color: 'white' }} className="label-create">Notes</label>
                    <div className="notes-container-create">
                        {noteOptions.map((note) => (
                            <div key={note.label} className="notes-checkbox-create">
                                <label className="notes-label-create">
                                    <input
                                        type="checkbox"
                                        checked={formData.notes.some((n) => n.label === note.label)}
                                        onChange={() => handleNoteChange(note)}
                                    />
                                    <span className="notes-icon-create">{note.icon}</span>
                                    {note.label}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="right-column">
                    <div className="form-create-wine">
                        {/* Campos del formulario */}
                        <label style={{ fontWeight: 'bold', color: 'white' }} htmlFor="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Enter wine name"
                            value={formData.name}
                            onChange={handleChange}
                        />

                        <label style={{ fontWeight: 'bold', color: 'white' }} htmlFor="price">Price (€)</label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            placeholder="Enter price"
                            value={formData.price}
                            onChange={handleChange}
                        />
                        <label htmlFor="year" style={{ fontWeight: 'bold', color: 'white' }}>Year</label>
                        <input
                            type="number"
                            id="year"
                            name="year"
                            placeholder="Enter the wine's year"
                            value={formData.year || 2018}
                            onChange={handleChange}
                        />

                        <label style={{ fontWeight: 'bold', color: 'white' }} htmlFor="brand">Brand</label>
                        <input
                            type="text"
                            id="brand"
                            name="brand"
                            placeholder="Enter wine brand"
                            value={formData.brand}
                            onChange={handleChange}
                        />

                        <label style={{ fontWeight: 'bold', color: 'white' }} htmlFor="grapetype">Grape Type</label>
                        <div className="Select__wrapper">
                            <Select
                                options={grapeTypes}
                                onChange={handleGrapeTypeChange}
                                placeholder="Select a grape type"
                                isClearable
                                styles={{
                                    control: (base) => ({
                                        ...base,
                                        borderColor: '#a43d4e',
                                        backgroundColor: '#ffffff',
                                        '&:hover': { borderColor: '#892e3e' },
                                    }),
                                    menu: (base) => ({
                                        ...base,
                                        backgroundColor: '#a43d4e',
                                        color: 'white',
                                        borderRadius: '5px',
                                        zIndex: 9999,
                                    }),
                                    option: (base, { isFocused, isSelected }) => ({
                                        ...base,
                                        backgroundColor: isSelected ? '#6f2733' : isFocused ? '#892e3e' : '#a43d4e',
                                        color: 'white',
                                        cursor: 'pointer',
                                    }),
                                    placeholder: (base) => ({
                                        ...base,
                                        color: 'gray',
                                    }),
                                    singleValue: (base) => ({
                                        ...base,
                                        color: '#892e3e',
                                    }),
                                }}
                            />
                        </div>

                        <label style={{ fontWeight: 'bold', color: 'white' }} htmlFor="brand">Color</label>
                        <div className="two-column-layout-wines">
                            <div className={`right-column-wines ${formData.color === 'Red' ? 'highlighted' : ''}`}>
                                <img
                                    src={RedWineImage}
                                    alt="Red Wine"
                                    className="redwine-image"
                                />
                            </div>
                            <div className={`left-column-wines ${formData.color === 'White' ? 'highlighted' : ''}`}>
                                <img
                                    src={WhiteWineImage}
                                    alt="White Wine"
                                    className="whitewine-image"
                                />
                            </div>
                        </div>

                        <label htmlFor="experience" style={{ fontWeight: 'bold', color: 'white' }}>Experience</label>
                        <div className="Select__wrapper">
                            <Select
                                options={experiences.map((exp) => ({
                                    value: exp._id,
                                    label: exp.title,
                                }))}
                                onChange={handleExperienceChange}
                                placeholder="Select an experience"
                                isClearable
                                styles={{
                                    control: (base) => ({
                                        ...base,
                                        borderColor: '#a43d4e',
                                        backgroundColor: '#ffffff',
                                        '&:hover': { borderColor: '#892e3e' },
                                    }),
                                    menu: (base) => ({
                                        ...base,
                                        backgroundColor: '#a43d4e',
                                        color: 'white',
                                        borderRadius: '5px',
                                        zIndex: 9999,
                                    }),
                                    option: (base, { isFocused, isSelected }) => ({
                                        ...base,
                                        backgroundColor: isSelected ? '#6f2733' : isFocused ? '#892e3e' : '#a43d4e',
                                        color: 'white',
                                        cursor: 'pointer',
                                    }),
                                    placeholder: (base) => ({
                                        ...base,
                                        color: 'gray',
                                    }),
                                    singleValue: (base) => ({
                                        ...base,
                                        color: '#892e3e',
                                    }),
                                }}
                            />
                        </div>
                    </div>
                    <button className="create-btn" onClick={handleSubmit}>
                        Create Wine
                    </button>

                </div>
            </div>
            {/* Modal de éxito */}
            {
                showModal && (
                    <div className="modal">
                        <div className="modal-content">
                            <h3>Wine is being created. Redirecting to the main menu...</h3>
                        </div>
                    </div>
                )
            }
        </NavWineMaker >
    );
};

export default CreateWine;
