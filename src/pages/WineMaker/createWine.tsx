import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/home.css'; // Reutilizamos los estilos existentes
import NavWineMaker from '../../components/NavWineMaker';
import wineService from '../../services/wineService'; // Servicio para gestionar vinos
import createBackground from '../../assets/vinito.png';
import { Service } from '../../models/serviceModel';
import { Wine } from '../../models/wineModel';

// Opciones de sabores
const flavourOptions: Service[] = [
    { icon: "🍒", label: "Cherry" },
    { icon: "🍓", label: "Strawberry" },
    { icon: "🍋", label: "Citrus" },
    { icon: "🍫", label: "Chocolate" },
    { icon: "🌿", label: "Herbaceous" },
    { icon: "🌰", label: "Nutty" },
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
        flavours: [],
    });

    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    // Obtener el ID del propietario desde localStorage
    useEffect(() => {
        const userId = localStorage.getItem('id');
        if (userId) {
            setFormData((prevData) => ({
                ...prevData,
                owner: userId,
            }));
        } else {
            setError('User ID not found in localStorage');
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFlavourChange = (flavour: Service) => {
        setFormData((prev) => ({
            ...prev,
            flavours: prev.flavours.some((f) => f.label === flavour.label)
                ? prev.flavours.filter((f) => f.label !== flavour.label)
                : [...prev.flavours, flavour],
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
            <div className="home-container">
                <div
                    className="top-plans"
                    style={{ backgroundImage: `url(${createBackground})` }}
                >
                    <div className="top-plans-content">
                        <h1>Create</h1>
                        <h2>New Wine</h2>
                        <p>Design your unique wine</p>
                    </div>
                </div>

                {error && <div className="error-message">{error}</div>} {/* Muestra el mensaje de error si ocurre */}

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

                    <label style={{ fontWeight: 'bold', color: 'white' }} htmlFor="color">Color</label>
                    <input
                        type="text"
                        id="color"
                        name="color"
                        placeholder="Enter wine color"
                        value={formData.color}
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
                    <input
                        type="text"
                        id="grapetype"
                        name="grapetype"
                        placeholder="Enter grape type"
                        value={formData.grapetype}
                        onChange={handleChange}
                    />

                    <label style={{ fontWeight: 'bold', color: 'white' }} className="label-create">Flavours</label>
                    <div className="flavours-container-create">
                        {flavourOptions.map((flavour, index) => (
                            <div key={flavour.label} className="flavour-checkbox-create">
                                <label className="flavour-label-create">
                                    <input
                                        type="checkbox"
                                        checked={formData.flavours.some((f) => f.label === flavour.label)}
                                        onChange={() => handleFlavourChange(flavour)}
                                    />
                                    <span className="flavour-icon-create">{flavour.icon}</span>
                                    {flavour.label}
                                </label>
                            </div>
                        ))}
                    </div>

                    <button className="create-btn" onClick={handleSubmit}>
                        Create Wine
                    </button>
                </div>
            </div>

            {/* Modal de éxito */}
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Wine is being created. Redirecting to the main menu...</h3>
                    </div>
                </div>
            )}
        </NavWineMaker>
    );
};

export default CreateWine;
