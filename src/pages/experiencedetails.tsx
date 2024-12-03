import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/experiencedetails.css';

const ExperienceDetails = () => {
    const { id } = useParams(); // Obtener el ID de la experiencia desde la URL
    const navigate = useNavigate();

    const experience = {
        id: 1,
        name: "Scala Dei",
        location: "Priorat",
        price: "$$$$",
        rating: 4.93,
        reviews: 273,
        images: [
            "/assets/experience1.jpg",
            "/assets/experience2.jpg",
            "/assets/experience3.jpg",
            "/assets/experience4.jpg",
        ],
        amenities: [
            { icon: "🍷", label: "Wine tastings" },
            { icon: "🍴", label: "Restaurant" },
            { icon: "🅿️", label: "Parking" },
            { icon: "🌿", label: "Vineyard tours" },
            { icon: "🍇", label: "Winery tours" },
            { icon: "🐾", label: "Pet friendly" },
        ],
        about: `
            A fusion of tradition and innovation embedded in our meticulously crafted wines.
            Experience the essence of our boutique winery through personalized tastings,
            guided tours around the vineyards, and exclusive events.`,
        locationDetails: "Plaça del Priorat, 1, Escaladei, Tarragona",
    };

    return (
        <div className="experience-details">
            <div className="header">
                <button onClick={() => navigate(-1)}>← Back</button>
                <h1>{experience.name}</h1>
                <button className="favorite">♡</button>
            </div>

            <div className="images-gallery">
                {experience.images.map((img, index) => (
                    <img key={index} src={img} alt={`Experience ${index + 1}`} />
                ))}
            </div>

            <div className="details">
                <h2>{experience.name}</h2>
                <p>
                    <strong>{experience.location}</strong> • {experience.price} • {experience.rating} ★ ({experience.reviews} reviews)
                </p>
                <div className="amenities">
                    {experience.amenities.map((amenity, index) => (
                        <div key={index} className="amenity">
                            <span>{amenity.icon}</span>
                            <p>{amenity.label}</p>
                        </div>
                    ))}
                </div>

                <h3>About</h3>
                <p>{experience.about}</p>

                <h3>Location</h3>
                <p>{experience.locationDetails}</p>

                <div className="map">
                    <img src="/assets/map-placeholder.jpg" alt="Map location" />
                </div>
            </div>

            <button className="book-now">Book Now</button>
        </div>
    );
};

export default ExperienceDetails;
