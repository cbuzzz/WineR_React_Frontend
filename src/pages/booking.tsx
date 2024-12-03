import React from 'react';
import '../styles/booking.css'; // Archivo CSS para estilos

// Interfaz para las experiencias
interface Experience {
    id: string;
    title: string;
    location: string;
    date: string;
    time: string;
    guests: string;
    activities: string[];
    image: string;
}

// Componente de tarjeta individual para experiencias
const ExperienceCard: React.FC<{ experience: Experience }> = ({ experience }) => {
    return (
        <div className="experience-card">
            <img src={experience.image} alt={experience.title} className="experience-image" />
            <div className="experience-info">
                <h3>{experience.title}</h3>
                <p className="experience-location">{experience.location}</p>
                <p className="experience-date">
                    {experience.date} - {experience.time}
                </p>
                <p className="experience-guests">{experience.guests}</p>
                <p className="experience-activities">{experience.activities.join(', ')}</p>
                <button className="share-button">Take me there!</button>
            </div>
        </div>
    );
};

const Booking: React.FC = () => {
    // Datos simulados que en el futuro vendrán desde el backend
    const experiences: Experience[] = [
        {
            id: '1',
            title: 'Scala Dei',
            location: 'Tarragona',
            date: 'Dec 11',
            time: '10:00 AM',
            guests: '2 Adults',
            activities: ['Wine Tasting'],
            image: '/images/scala-dei.jpg',
        },
        {
            id: '2',
            title: 'Alvaro Palacios',
            location: 'Tarragona',
            date: 'Jan 4',
            time: '3:00 PM',
            guests: '2 Adults',
            activities: ['Vineyard Tour', 'Wine Tasting'],
            image: '/images/alvaro-palacios.jpg',
        },
    ];

    return (
        <div className="booking-container">
            <header className="booking-header">
                <h1>Upcoming Bookings</h1>
                <div className="booking-actions">
                    <input type="text" placeholder="Search..." className="search-bar1" />
                    <button className="filter-button">Filters</button>
                </div>
            </header>
            <div className="experience-list">
                {experiences.map((experience) => (
                    <ExperienceCard key={experience.id} experience={experience} />
                ))}
            </div>
        </div>
    );
};

export default Booking;
