import axios from 'axios';

const API_URL = 'http://localhost:3000/api/chat'; // Actualiza con la URL de tu backend
// const API_URL = 'http://apiwiner.duckdns.org:5000/api/chat';

// Helper para obtener el token del localStorage
const getToken = (): string | null => {
    return localStorage.getItem('token');
};

// Helper para obtener los headers con el token
const getHeaders = () => {
    const token = getToken();
    return {
        headers: {
            'auth-token': token || '',
        },
    };
};

// Obtener las salas en las que participa el usuario
const getUserRooms = async (username: string): Promise<any[]> => {
    try {
        const response = await axios.get(`${API_URL}/rooms/${username}`, getHeaders());
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch user rooms');
    }
};

// Obtener los mensajes previos de una sala
const getMessagesFromRoom = async (roomName: string): Promise<any[]> => {
    try {
        const response = await axios.get(`${API_URL}/messages/${roomName}`, getHeaders());
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch messages');
    }
};

export default {
    getUserRooms,
    getMessagesFromRoom,
};
