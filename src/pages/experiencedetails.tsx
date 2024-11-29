import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getExperienceDetails } from '../services/api';

const ExperienceDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [experience, setExperience] = useState<any>(null);

    useEffect(() => {
        const fetchExperience = async () => {
            try {
                const response = await getExperienceDetails(id || '');
                setExperience(response.data);
            } catch (error) {
                console.error('Error fetching experience details:', error);
            }
        };
        fetchExperience();
    }, [id]);

    if (!experience) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>{experience.name}</h1>
            <img src={experience.image} alt={experience.name} />
            <p>{experience.description}</p>
            <p>Price: ${experience.price}</p>
            <button>Book Now</button>
        </div>
    );
};

export default ExperienceDetails;
