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
    async updateUser(password: string) { // Odebrán parametr `email`
      if (!this.user) {
        throw new Error('User is not logged in');
      }

      // Odeslat pouze heslo, email se nemění
      const response = await axios.put(
          '/api/user/update',
          { password }, // Odesíláme pouze heslo
          {
            headers: {
              Authorization: `Bearer ${this.user.token}`,
            },
          }
      );

      // Aktualizujeme pouze token (pokud se změní) a zachováme původní email
      this.user = { ...this.user, token: response.data.token };
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
      window.location.href = '/login';
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
      } else {
        this.user = null; // Explicitně nastavte na null, pokud uživatel není přihlášen
      }
    },
  },
});