import axios from 'axios';
import { User } from '../models/userModel';

const API_URL = 'http://localhost:5000/api'; // Update with your backend URL

const login = async (username: string, password: string): Promise<{ user: User; token: string }> => {
    try {
        const response = await axios.post(`${API_URL}/user/logIn`, { username, password });
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
        const response = await axios.post(`${API_URL}/user/`, userData);
        return response.data; // Newly created user
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data?.message || 'Signup failed';
            throw new Error(errorMessage);
        }
        throw new Error('An unexpected error occurred');
    }
};

export default {
    login,
    signup,
};
