import axios from 'axios';

// const API_URL = 'http://localhost:3000/api/grapetypes';
const API_URL = 'http://apiwiner.duckdns.org:5000/api/grapetypes';

const getGrapeTypes = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data; // Verifica que `response.data` contenga la lista
    } catch (error) {
        console.error('Error fetching grape types:', error);
        throw error;
    }
};

export default { getGrapeTypes };
