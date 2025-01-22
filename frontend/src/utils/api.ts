import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

// Vytvoř instanci axios
const api = axios.create({
    baseURL: '/api', // Základní URL pro všechny požadavky
});

// Přidej interceptor pro přidání tokenu do hlavičky
api.interceptors.request.use((config) => {
    const authStore = useAuthStore();
    const token = authStore.user?.token;

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default api;