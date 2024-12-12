import axios from 'axios';
import { User } from '../models/userModel';
import { Experience } from '../models/experienceModel';

const API_URL = 'http://localhost:3000/api/user'; // Update with your backend URL

// Helper to get token from localStorage
const getToken = (): string | null => {
    return localStorage.getItem('auth-token');
};

// Helper to get headers with token
const getHeaders = () => {
    const token = getToken();
    return {
        headers: {
            'auth-token': token || '', // Add token or send empty string
        },
    };
};

// Método para logearse
const login = async (username: string, password: string): Promise<{ user: User; token: string }> => {
    try {
        const response = await axios.post(`${API_URL}/logIn`, { username, password });
        const { token } = response.data;
        localStorage.setItem('auth-token', token);
        return response.data; // user and token
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data?.message || 'Invalid login credentials';
            throw new Error(errorMessage);
        }
        throw new Error('An unexpected error occurred');
    }
};

// Método para registrar un nuevo usuario
const signup = async (userData: Omit<User, '_id' | 'habilitado'>): Promise<User> => {
    try {
        const response = await axios.post(`${API_URL}/`, userData);
        return response.data; // Newly created user
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data?.message || 'Signup failed';
            throw new Error(errorMessage);
        }
        throw new Error('An unexpected error occurred');
    }
};

// Fetch experiences for the logged-in user
const fetchUserExperiences = async (): Promise<Experience[]> => {
    try {
        const response = await axios.get(`${API_URL}/experiences/all`, getHeaders());
        return response.data.experiences;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 401) {
                throw new Error('Unauthorized: Please log in again.');
            }
            const errorMessage = error.response?.data?.message || 'Failed to fetch experiences';
            throw new Error(errorMessage);
        }
        throw new Error('An unexpected error occurred');
    }
};


// Logout function to clear the token
const logout = () => {
    localStorage.removeItem('auth-token'); // Remove token from localStorage
};

const getUserById = async (userId: string) => {
    // Obtener el token del localStorage (o de donde lo estés almacenando)
    const token = localStorage.getItem('token');
    console.log(localStorage.getItem('token'));


    // Si no hay token, lanzar un error o manejarlo de alguna forma
    if (!token) {
        throw new Error('No auth token found');
    }

    try {
        // Hacer la solicitud con el token en las cabeceras
        const response = await axios.get(`${API_URL}/profile/${userId}`, {
            headers: {
                'auth-token': token, // Aquí agregamos el token en la cabecera
            },
        });

        return response.data; // Devolvemos los datos del usuario
    } catch (error) {
        // Manejo de errores
        throw new Error('Failed to fetch user data');
    }
};

// Obtener amigos y solicitudes del usuario logeado
const getFriendsAndRequests = async (userId: string): Promise<{ amigos: string[]; solicitudes: string[] }> => {
    try {
        const response = await axios.get(`${API_URL}/${userId}`, getHeaders());
        return {
            amigos: response.data.amigos,
            solicitudes: response.data.solicitudes,
        };
    } catch (error) {
        throw new Error('Failed to fetch friends and requests');
    }
};

// Aceptar una solicitud de amistad
const acceptFriendRequest = async (username: string): Promise<void> => {
    try {
        const loggedUser = localStorage.getItem('username');
        await axios.get(`${API_URL}/friend/${username}/${loggedUser}`, getHeaders());
    } catch (error) {
        throw new Error('Failed to accept friend request');
    }
};

// Rechazar una solicitud de amistad
const rejectFriendRequest = async (username: string): Promise<void> => {
    try {
        const loggedUser = localStorage.getItem('username');
        await axios.delete(`${API_URL}/solicitud/${loggedUser}/${username}`, getHeaders());
    } catch (error) {
        throw new Error('Failed to reject friend request');
    }
};

// Eliminar un amigo
const removeFriend = async (username: string): Promise<void> => {
    try {
        const loggedUser = localStorage.getItem('username');
        await axios.delete(`${API_URL}/friend/${loggedUser}/${username}`, getHeaders());
    } catch (error) {
        throw new Error('Failed to remove friend');
    }
};

const sendFriendRequest = async (targetUsername: string): Promise<void> => {
    try {
        const loggedUsername = localStorage.getItem('username');

        const response = await axios.get(
            `http://localhost:3000/api/user/solicitud/${targetUsername}/${loggedUsername}`,
            getHeaders()
        );
        console.log('Solicitud enviada:', response.data);
    } catch (error) {
        throw new Error('Failed to send friend request');
    }
};

export default {
    login,
    signup,
    fetchUserExperiences,
    logout,
    getUserById,
    getFriendsAndRequests,
    acceptFriendRequest,
    rejectFriendRequest,
    removeFriend,
    sendFriendRequest,
};
