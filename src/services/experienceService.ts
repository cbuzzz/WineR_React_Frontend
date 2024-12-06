
import axios from 'axios';
import { Experience } from '../models/experienceModel';

const API_URL = 'http://localhost:3000/api/experiencias'; // Update this base URL if necessary

// Fetch all experiences from the backend
const getAllExperiences = async (): Promise<Experience[]> => {
    try {
        const response = await axios.get<Experience[]>(API_URL);
        return response.data; // Backend should return the array of experiences
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || 'Failed to fetch experiences');
        }
        throw new Error('An unexpected error occurred');
    }
};

// Fetch a specific experience by ID
const getExperienceById = async (id: string): Promise<Experience> => {
    try {
        const response = await axios.get<Experience>(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || 'Failed to fetch experience');
        }
        throw new Error('An unexpected error occurred');
    }
};

export default {
    getAllExperiences,
    getExperienceById,
};
