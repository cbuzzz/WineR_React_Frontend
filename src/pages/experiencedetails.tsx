import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/experiencedetails.css';
import experienceService from '../services/experienceService';
import { Experience } from '../models/experienceModel';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { getCoordinates } from '../utils/geocoding'; // Import the geocoding utility

// Fix Leaflet marker icon compatibility in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});

const ExperienceDetails = () => {
    const { id } = useParams<{ id: string }>(); // Get the experience ID from the URL
    const navigate = useNavigate();
    const [experience, setExperience] = useState<Experience | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [coordinates, setCoordinates] = useState<[number, number] | null>(null);

    useEffect(() => {
        const fetchExperience = async () => {
            try {
                if (id) {
                    const data = await experienceService.getExperienceById(id);
                    setExperience(data);

                    const coords = await getCoordinates(data.location); // Fetch coordinates dynamically
                    setCoordinates(coords);
                }
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('An unexpected error occurred');
                }
            }
        };

        fetchExperience();
    }, [id]);

    if (error) {
        return (
            <div className="experience-details">
                <button onClick={() => navigate(-1)}>← Back</button>
                <p className="error-message">{error}</p>
            </div>
        );
    }

    if (!experience) {
        return (
            <div className="experience-details">
                <button onClick={() => navigate(-1)}>← Back</button>
                <p>Loading...</p>
            </div>
        );
    }

    // const experience = {
    //     id: 1,
    //     name: "Scala Dei",
    //     location: "Priorat",
    //     price: "$$$$",
    //     rating: 4.93,
    //     reviews: 273,
    //     images: [
    //         "/assets/experience1.jpg",
    //         "/assets/experience2.jpg",
    //         "/assets/experience3.jpg",
    //         "/assets/experience4.jpg",
    //     ],
    //     amenities: [
    //         { icon: "🍷", label: "Wine tastings" },
    //         { icon: "🍴", label: "Restaurant" },
    //         { icon: "🅿️", label: "Parking" },
    //         { icon: "🌿", label: "Vineyard tours" },
    //         { icon: "🍇", label: "Winery tours" },
    //         { icon: "🐾", label: "Pet friendly" },
    //     ],
    //     about: `
    //         A fusion of tradition and innovation embedded in our meticulously crafted wines.
    //         Experience the essence of our boutique winery through personalized tastings,
    //         guided tours around the vineyards, and exclusive events.`,
    //     locationDetails: "Plaça del Priorat, 1, Escaladei, Tarragona",
    // };

    return (
        <div className="experience-details">
            <div className="header">
                <button onClick={() => navigate(-1)}>← Back</button>
                <h1>{experience.title}</h1>
                <button className="favorite">♡</button>
            </div>

            {/* <div className="images-gallery">
                {experience.images.map((img, index) => (
                    <img key={index} src={img} alt={`Experience ${index + 1}`} />
                ))}
            </div> */}

            <div className="details">
                <h2>{experience.contactmail}</h2>
                <p>
                    <strong>{experience.location}</strong> • {experience.date}
                </p>
                <p>
                    Price: {experience.price} € • {experience.rating} ★ ({experience.reviews.length} reviews)
                </p>
                <div className="services">
                    {experience.services.map((service, index) => (
                        <div key={index} className="service">
                            <span>{service.icon}</span>
                            <p>{service.label}</p>
                        </div>
                    ))}
                </div>

                <h3>About</h3>
                <p>{experience.description}</p>

                <h3>Location</h3>

                <div className="map">
                    {coordinates ? (
                        <MapContainer center={coordinates} zoom={13} style={{ height: '400px', width: '100%' }}>
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
                            />
                            <Marker position={coordinates}>
                                <Popup>{experience.location}</Popup>
                            </Marker>
                        </MapContainer>
                    ) : (
                        <p>Loading map...</p>
                    )}
                </div>
            </div>
            <button className="book-now">Book Now</button>
        </div>
    );
};

export default ExperienceDetails;
