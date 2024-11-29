import React, { useEffect, useState } from 'react';
import { getExperiences } from '../services/api';

const Home: React.FC = () => {
    const [experiences, setExperiences] = useState([]);

    useEffect(() => {
        const fetchExperiences = async () => {
            try {
                const response = await getExperiences();
                setExperiences(response.data);
            } catch (error) {
                console.error('Error fetching experiences:', error);
            }
        };
        fetchExperiences();
    }, []);

    return (
        <div>
            <h1>Welcome to WineR</h1>
            {experiences.map((exp: any) => (
                <div key={exp.id}>
                    <h2>{exp.name}</h2>
                    <p>{exp.description}</p>
                </div>
            ))}
        </div>
    );
};

export default Home;
