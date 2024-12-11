import axios from 'axios';
import { User } from '../models/userModel';

const API_URL = 'http://localhost:3000/api/user'; // Actualiza con tu URL de backend

// Método para logearse
const login = async (username: string, password: string): Promise<{ user: User; token: string }> => {
    try {
        const response = await axios.post(`${API_URL}/logIn`, { username, password });
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
export default {
    login,
    signup,
    getUserById,
};
