import axios from 'axios';
import { Experience } from '../models/experienceModel';

const API_URL = 'http://localhost:3000/api/experiencias'; // Actualiza esta URL base si es necesario

// Helper para obtener headers con token (ahora con 'auth-token')
const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            'auth-token': token || '', // Cambiado a 'auth-token'
        },
    };
};

const addUserToExperience = async (experienceId: string, userId: string): Promise<Experience> => {
    try {
        console.log("Llega aquí");
        
        // Ajusta la URL para incluir los parámetros dinámicos
        const response = await axios.post(
            `${API_URL}/Participant/${experienceId}/${userId}`, // Ruta dinámica
            {}, // No se necesita body, los datos están en la URL
            getHeaders() // Encabezados con 'auth-token'
        );

        console.log(response.data);
        return response.data; // Devuelve la experiencia actualizada
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data?.message || 'Failed to add user to experience';
            throw new Error(errorMessage);
        }
        throw new Error('An unexpected error occurred');
    }
};

// Otros métodos del servicio
const getAllExperiences = async (): Promise<Experience[]> => {
    try {
        const response = await axios.get<Experience[]>(API_URL, getHeaders()); // Usa 'getHeaders' aquí también
        return response.data; // Backend should return the array of experiences
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || 'Failed to fetch experiences');
        }
        throw new Error('An unexpected error occurred');
    }
};

const getExperienceById = async (id: string): Promise<Experience> => {
    try {
        const response = await axios.get<Experience>(`${API_URL}/${id}`, getHeaders()); // Usa 'getHeaders' aquí también
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || 'Failed to fetch experience');
        }
        throw new Error('An unexpected error occurred');
    }
};

const createExperience = async (experienceData: Omit<Experience, '_id' | 'rating' | 'reviews'>): Promise<Experience> => {
    try {
        const response = await axios.post(`${API_URL}/`, experienceData, getHeaders()); // Usa 'getHeaders' aquí también
        return response.data; // Experiencia recién creada
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data?.message || 'Failed to create experience';
            throw new Error(errorMessage);
        }
        throw new Error('An unexpected error occurred');
    }
};

export default {
    getAllExperiences,
    getExperienceById,
    createExperience,
    addUserToExperience, // Exporta esta función
};
