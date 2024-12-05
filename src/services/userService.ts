import axios from 'axios';
import { User } from '../models/userModel';

const API_URL = 'http://localhost:3000/api'; // Update with your backend URL

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

export default {
    login,
};
