import axios from 'axios';
import { User } from '../models/userModel';
import { Experience } from '../models/experienceModel';
import { idText } from 'typescript';

// const API_URL = 'http://localhost:3000/api/user'; // Update with your backend URL

//const API_URL = 'http://147.83.7.158:5000/api/user';´

const API_URL = 'http://apiwiner.duckdns.org:5000/api/user';

// Helper para obtener el token del localStorage
const getToken = (): string | null => {
    return localStorage.getItem('token');
};

// Helper para obtener los headers con el token (cambiado a 'auth-token')
const getHeaders = () => {
    const token = getToken();
    return {
        headers: {
            'auth-token': token || '', // Cambiado a 'auth-token'
        },
    };
};

const updateUser = async (id: string, updatedUserData: Partial<User>): Promise<User> => {
    try {
        console.log("Llega al servicio de actualización de usuario");
        console.log(updatedUserData);

        // Ajusta la URL para incluir el ID del usuario
        const response = await axios.put(
            `${API_URL}/${id}`, // La ruta debe ser `/id` según tu backend
            updatedUserData, // Los datos que deseas actualizar
            getHeaders() // Incluye los encabezados de autenticación
        );

        console.log('Usuario actualizado:', response.data);
        return response.data; // Devuelve los datos del usuario actualizado
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data?.message || 'Failed to update user';
            throw new Error(errorMessage);
        }
        throw new Error('An unexpected error occurred');
    }
};



// Método para logearse
const login = async (username: string, password: string): Promise<{ user: User; token: string }> => {
    try {
        const response = await axios.post(`${API_URL}/logIn`, { username, password });
        const { token } = response.data;
        localStorage.setItem('token', token);
        return response.data; // user and token
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data?.message || 'Invalid login credentials';
            throw new Error(errorMessage);
        }
        throw new Error('An unexpected error occurred');
    }
};

const googleLoginLover = async (googleToken: string): Promise<{ user: User; token: string }> => {
    try {
        const response = await axios.post(`${API_URL}/reactGoogleLoginLover`, { token: googleToken });
        const { user, token } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('auth-token', token);
        localStorage.setItem('id', user._id.toString());
        localStorage.setItem('username', user.username);
        return response.data; // user and token
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data?.message || 'Google login failed';
            if (error.response?.status === 500) {
                throw new Error('Internal Server Error: Please try again later.');
            }
            throw new Error(errorMessage);
        }
        throw new Error('An unexpected error occurred');
    }
};

const googleLoginMaker = async (googleToken: string): Promise<{ user: User; token: string }> => {
    try {
        const response = await axios.post(`${API_URL}/reactGoogleLoginMaker`, { token: googleToken });
        const { user, token } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('auth-token', token);
        localStorage.setItem('id', user._id.toString());
        localStorage.setItem('username', user.username);
        return response.data; // user and token
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data?.message || 'Google login failed';
            if (error.response?.status === 500) {
                throw new Error('Internal Server Error: Please try again later.');
            }
            throw new Error(errorMessage);
        }
        throw new Error('An unexpected error occurred');
    }
};

// Método para registrar un nuevo usuario
const signup = async (userData: Omit<User, '_id' | 'habilitado'>): Promise<User> => {
    try {
        const response = await axios.post(`${API_URL}/`, userData);
        return response.data; // Usuario recién creado
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data?.message || 'Signup failed';
            throw new Error(errorMessage);
        }
        throw new Error('An unexpected error occurred');
    }
};

// Fetch experiencias para el usuario logueado
const fetchUserExperiences = async (): Promise<Experience[]> => {
    try {
        const response = await axios.get(`${API_URL}/experiences/all`, getHeaders());
        console.log('Experiences fetched:', response.data.experiences);
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

// Método para añadir una experiencia a un usuario
const addExperienceToUser = async (experienceId: string, userId: string): Promise<Experience> => {
    try {
        console.log("Llega aquí");

        // Ajusta la URL para incluir los parámetros dinámicos
        const response = await axios.post(
            `${API_URL}/addExpToPart/${experienceId}/${userId}`, // Ruta dinámica
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

// Obtener el perfil de un usuario por ID
const getUserById = async (userId: string) => {
    const token = localStorage.getItem('token');
    console.log(localStorage.getItem('token'));

    if (!token) {
        throw new Error('No auth token found');
    }

    try {
        const response = await axios.get(`${API_URL}/profile/${userId}`, {
            headers: {
                'auth-token': token, // Usar 'auth-token' en lugar de 'token'
            },
        });

        return response.data; // Devuelve los datos del usuario
    } catch (error) {
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
        await axios.delete(`${API_URL}/solicitud/${loggedUser}/${username}`, getHeaders());
        //await axios.delete(`${API_URL}/solicitud/${loggedUser}/${username}`, getHeaders());
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
        if (!loggedUsername) throw new Error('User not logged in');

        await axios.get(
            `${API_URL}/solicitud/${targetUsername}/${loggedUsername}`,
            getHeaders()
        );
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            throw new Error('User not found');
        }
        throw new Error('Failed to send friend request');
    }
};

const getUserProfile = async (username: string): Promise<User> => {
    try {
        const response = await axios.get(`${API_URL}/profile/username/${username}`, getHeaders());
        return response.data; // Devuelve el perfil del usuario
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data?.message || 'Failed to fetch user profile';
            throw new Error(errorMessage);
        }
        throw new Error('An unexpected error occurred');
    }
};

const removeExperienceFromUser = async (experienceId: string, userId: string): Promise<void> => {
    try {
        console.log("ENTRA AQUI")
        await axios.delete(
            `${API_URL}/deleteExpFromUser/${experienceId}/${userId}`, // Ruta ajustada sin 'participant'
            getHeaders() // Agrega encabezados si es necesario, como Authorization
        );
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || 'Failed to remove user from experience');
        }
        throw new Error('An unexpected error occurred');
    }
};

// Obtener las experiencias del usuario por token (usando 'id' en lugar de 'userId')
const getUserExperiences = async () => {
    const token = localStorage.getItem('token'); // Obtener el token del localStorage
    const id = localStorage.getItem('id'); // Obtener el 'id' del localStorage

    if (!token) {
        throw new Error('No auth token found');
    }

    if (!id) {
        throw new Error('No user ID found');
    }

    try {
        console.log("Entra aqui")
        // Llamada a la API backend para obtener las experiencias del usuario
        const response = await axios.get(`${API_URL}/experiences/${id}`, {
            headers: {
                'auth-token': token, // Usar 'auth-token' en lugar de 'Authorization'
            },
        });
        console.log("Recibo estas experiencias:", response.data.experiences)

        return response.data.experiences; // Devuelve las experiencias del usuario
    } catch (error) {
        throw new Error('Failed to fetch user experiences');
    }
};

const uploadProfileImage = async (userId: string, imageFormData: FormData): Promise<void> => {
    try {
        await axios.post(`http://apiwiner.duckdns.org:5000/api/images/update-image/user/${userId}`, imageFormData, {
            headers: {
                'auth-token': localStorage.getItem('token') || '',
                'Content-Type': 'multipart/form-data',
            },
        });
        console.log('Profile image uploaded successfully');
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data?.message || 'Failed to upload profile image';
            throw new Error(errorMessage);
        }
        throw new Error('An unexpected error occurred during profile image upload');
    }
};

export default {
    login,
    googleLoginLover,
    googleLoginMaker,
    signup,
    fetchUserExperiences,
    addExperienceToUser,
    getUserById,
    getFriendsAndRequests,
    acceptFriendRequest,
    rejectFriendRequest,
    removeFriend,
    sendFriendRequest,
    getUserProfile,
    updateUser,
    getUserExperiences,
    removeExperienceFromUser,
    uploadProfileImage,
};
