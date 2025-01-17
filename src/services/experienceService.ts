import axios from 'axios';
import { Experience } from '../models/experienceModel';

const API_URL = 'http://localhost:3000/api/experiencias'; // Actualiza esta URL base si es necesario

// const API_URL = 'http://147.83.7.158:5000/api/experiencias';

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

const añadirValoracion = async (experienceId: string, rating: number, comment: string): Promise<void> => {
    try {
        if (!experienceId) {
            console.error('Error: experienceId is undefined or null');
            return;
        }
        if (rating == null || isNaN(rating)) {
            console.error('Error: rating is not a valid number');
            return;
        }
        if (!comment || comment.trim() === "") {
            console.error('Error: comment is empty');
            return;
        }

        const userId = localStorage.getItem('id'); // Obtener el userId desde localStorage

        if (!userId) {
            console.error('Error: userId is undefined or null');
            return;
        }

        // Hacemos la solicitud a la API
        const response = await axios.post(
            `${API_URL}/rate/${experienceId}/${userId}`, // Ruta para calificar
            { 
                ratingValue: rating, // Valor de la calificación
                comment: comment // Comentario del usuario
            }, 
            getHeaders() // Incluye los encabezados con el token
        );

        console.log('Rating and comment submitted successfully:', response.data); // Log del resultado de la API
    } catch (error) {
        console.error('Error occurred during rating submission:', error);
        throw error;
    }
};

const getExperienceRatings = async (experienceId: string): Promise<any[]> => {
    try {
        console.log("Este es el id de la experiencia: ", experienceId)
        const response = await axios.get(`${API_URL}/ratings/${experienceId}`);
        return response.data; // Regresa las reseñas de la experiencia
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error fetching ratings:', error.response?.data || error.message);
        }
        throw new Error('Failed to fetch ratings');
    }
};

export default {
    getAllExperiences,
    getExperienceById,
    createExperience,
    addUserToExperience, // Exporta esta función
    añadirValoracion, // Exporta esta nueva función
    getExperienceRatings,
};
