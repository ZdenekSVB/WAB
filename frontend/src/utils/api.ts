import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

const api = axios.create({
    baseURL: 'http://localhost:4000/api', // Update this to match your backend URL
});

// Add interceptor to include the token in the request headers
api.interceptors.request.use((config) => {
    const authStore = useAuthStore();
    const token = authStore.user?.token;

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default api;