// frontend/stores/authStore.ts
import { defineStore } from 'pinia';
import axios from 'axios';

interface User {
  _id: string;
  email: string;
  token: string;
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
  }),
  actions: {
    async login(email: string, password: string) {
      const response = await axios.post('/api/user/login', { email, password });
      this.user = response.data; // Uložte uživatele do stavu
      localStorage.setItem('user', JSON.stringify(response.data)); // Uložte uživatele do localStorage
    },
    async signup(email: string, password: string) {
      const response = await axios.post('/api/user/signup', { email, password });
      this.user = response.data; // Uložte uživatele do stavu
      localStorage.setItem('user', JSON.stringify(response.data)); // Uložte uživatele do localStorage
    },
    logout() {
      this.user = null; // Odstraňte uživatele ze stavu
      localStorage.removeItem('user'); // Odstraňte uživatele z localStorage
      window.location.href = '/login'; // Přesměrujte uživatele na přihlašovací stránku
    },
    initialize() {
      const user = localStorage.getItem('user');
      if (user) {
        this.user = JSON.parse(user); // Inicializujte uživatele z localStorage
      }
    },
  },
});