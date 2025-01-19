import axios from 'axios';
import { Wine } from '../models/wineModel';

const API_URL = 'http://localhost:3000/api/wine';

// Helper para obtener headers con token (ahora con 'auth-token')
const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            'auth-token': token || '', // Cambiado a 'auth-token'
        },
    };
};

const createWine = async (wineData: Omit<Wine, '_id'>): Promise<Wine> => {
    try {
        const response = await axios.post(`${API_URL}/`, wineData, getHeaders()); // Ajusta la URL al endpoint de vinos
        return response.data; // Vino recién creado
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data?.message || 'Failed to create wine';
            throw new Error(errorMessage);
        }
        throw new Error('An unexpected error occurred');
    }
};

const getWines = async (): Promise<Wine[]> => {
    try {
        const response = await axios.get(`${API_URL}/`, getHeaders());
        return response.data; // Devuelve la lista de vinos desde el backend
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data?.message || 'Failed to fetch wines';
            throw new Error(errorMessage);
        }
        throw new Error('An unexpected error occurred');
    }
};

const getWinesByOwner = async (ownerId: string): Promise<Wine[]> => {
    try {
        const response = await axios.get(`${API_URL}/owner/${ownerId}`, getHeaders());
        return response.data;
    } catch (error) {
        console.error('Error fetching wines by owner:', error);
        throw new Error('Failed to fetch wines by owner');
    }
};

const uploadWineImage = async (wineId: string, imageFormData: FormData): Promise<void> => {
    try {
        await axios.post(`http://localhost:3000/api/images/update-image/wine/${wineId}`, imageFormData, {
            headers: {
                'auth-token': localStorage.getItem('token') || '',
                'Content-Type': 'multipart/form-data',
            },
        });
        console.log('Wine image uploaded successfully');
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data?.message || 'Failed to upload wine image';
            throw new Error(errorMessage);
        }
        throw new Error('An unexpected error occurred during image upload');
    }
};



export default {
    createWine,
    getWines,
    getWinesByOwner,
    uploadWineImage,
};
