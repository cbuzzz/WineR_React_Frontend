import axios from 'axios';

const GEOCODING_API_KEY = '7964e84aa8b94496b30e2ff44b60a684'; // Replace with your API key
const GEOCODING_API_URL = 'https://api.opencagedata.com/geocode/v1/json';

export const getCoordinates = async (location: string): Promise<[number, number]> => {
    try {
        const response = await axios.get(GEOCODING_API_URL, {
            params: {
                q: location,
                key: GEOCODING_API_KEY,
                limit: 1,
            },
        });

        if (response.data.results.length > 0) {
            const { lat, lng } = response.data.results[0].geometry;
            return [lat, lng];
        } else {
            throw new Error('No coordinates found for the provided location.');
        }
    } catch (error) {
        console.error('Error fetching coordinates:', error);
        throw new Error('Failed to fetch coordinates.');
    }
};
