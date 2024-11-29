import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api',
    timeout: 5000,
    headers: { 'Content-Type': 'application/json' },
});

// Ejemplo de endpoints:
export const loginUser = (data: { email: string, password: string }) =>
    api.post('/user/login', data);

export const getExperiences = () => api.get('/experiences');

export const getExperienceDetails = (id: string) =>
    api.get(`/experiences/${id}`);

export const bookExperience = (id: string, data: any) =>
    api.post(`/experiences/${id}/book`, data);

export default api;
