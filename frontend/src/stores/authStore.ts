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
      this.user = response.data as User;
      localStorage.setItem('user', JSON.stringify(response.data));
    },
    async signup(email: string, password: string) {
      const response = await axios.post('/api/user/signup', { email, password });
      this.user = response.data as User;
      localStorage.setItem('user', JSON.stringify(response.data));
    },
    async updateUser(email: string, password: string) {
      if (!this.user) {
        throw new Error('User is not logged in');
      }
      const response = await axios.put(
          '/api/user/update',
          { email, password },
          {
            headers: {
              Authorization: `Bearer ${this.user.token}`,
            },
          }
      );
      this.user = { ...this.user, email: response.data.email };
      localStorage.setItem('user', JSON.stringify(this.user));
    },
    async deleteUser() {
      if (!this.user) {
        throw new Error('User is not logged in');
      }
      await axios.delete('/api/user/delete', {
        headers: {
          Authorization: `Bearer ${this.user.token}`,
        },
      });
      this.user = null;
      localStorage.removeItem('user');
      window.location.href = '/login'; // Přesměrování na přihlašovací stránku
    },
    logout() {
      this.user = null;
      localStorage.removeItem('user');
      window.location.href = '/login';
    },
    initialize() {
      const user = localStorage.getItem('user');
      if (user) {
        this.user = JSON.parse(user) as User;
      }
    },
  },
});