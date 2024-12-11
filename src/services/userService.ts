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

export default {
    login,
    signup,
    fetchUserExperiences,
    logout,
};
