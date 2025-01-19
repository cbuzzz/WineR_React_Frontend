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

const removeUserFromExperience = async (experienceId: string, userId: string): Promise<void> => {
    try {
        console.log("ENTRA AQUI")
        await axios.delete(
            `${API_URL}/deleteUserFromExp/${experienceId}/${userId}`, // Ruta ajustada sin 'participant'
            getHeaders() // Agrega encabezados si es necesario, como Authorization
        );
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || 'Failed to remove user from experience');
        }
        throw new Error('An unexpected error occurred');
    }
};

const removeCommentFromExperience = async (experienceId: string, commentId: string): Promise<void> => {
    try {
        await axios.delete(
            `${API_URL}/${experienceId}/comment/${commentId}`, // Ruta ajustada para comentarios
            getHeaders() // Agrega encabezados si es necesario
        );
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || 'Failed to remove comment from experience');
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

const getUserExperiences = async (userId: string): Promise<Experience[]> => {
    try {
        const response = await axios.get<Experience[]>(
            `${API_URL}/user/exp/${userId}`,
            getHeaders()
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching experiences:', error);
        throw new Error('Failed to fetch user experiences');
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

const addWineToExperience = async (experienceId: string, wineId: string): Promise<void> => {
    try {
        const response = await axios.post(
            `${API_URL}/addWine/${experienceId}/${wineId}`,
            {},
            getHeaders()
        );
        console.log('Wine added to experience successfully:', response.data);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error adding wine to experience:', error.response?.data?.message || error.message);
        }
        throw new Error('Failed to add wine to experience');
    }
};

const updateExperience = async (id: string, updatedExperienceData: Partial<Experience>): Promise<Experience> => {
    try {
        console.log("Llega al servicio de actualización de experiencia");
        console.log(updatedExperienceData);

        // Ajusta la URL para incluir el ID de la experiencia
        const response = await axios.put(
            `${API_URL}/${id}`, // Ruta ajustada para actualizar la experiencia
            updatedExperienceData, // Datos a actualizar
            getHeaders() // Encabezados para autenticación
        );

        console.log('Experiencia actualizada:', response.data);
        return response.data; // Retorna la experiencia actualizada
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data?.message || 'Failed to update experience';
            throw new Error(errorMessage);
        }
        throw new Error('An unexpected error occurred');
    }
};


const uploadExperienceImage = async (experienceId: string, imageFormData: FormData): Promise<void> => {
    try {
        await axios.post(`http://localhost:3000/api/images/update-image/experience/${experienceId}`, imageFormData, {
            headers: {
                'auth-token': localStorage.getItem('token') || '',
                'Content-Type': 'multipart/form-data',
            },
        });
        console.log('Experience image uploaded successfully');
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data?.message || 'Failed to upload experience image';
            throw new Error(errorMessage);
        }
        throw new Error('An unexpected error occurred during image upload');
    }
};


export default {
    getAllExperiences,
    getExperienceById,
    createExperience,
    addUserToExperience,
    getUserExperiences,
    añadirValoracion,
    getExperienceRatings,
    addWineToExperience,
    uploadExperienceImage,
    removeUserFromExperience,
    removeCommentFromExperience,
    updateExperience,
};
