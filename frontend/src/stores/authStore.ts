import { defineStore } from 'pinia';
import axios from 'axios';

// Exportujeme rozhraní User
export interface User {
  _id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  nickname?: string;
  token: string;
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
  }),
  actions: {
    // Přihlášení uživatele
    async signup(
        email: string,
        password: string,
        firstName?: string,
        lastName?: string,
        nickname?: string
    ) {
      const response = await axios.post('/api/user/signup', {
        email,
        password,
        firstName,
        lastName,
        nickname,
      });
      this.user = response.data as User;
      localStorage.setItem('user', JSON.stringify(response.data));
    },

    // Přihlášení uživatele
    async login(credentials: { email?: string; nickname?: string; password: string }) {
      const response = await axios.post('/api/user/login', credentials);
      this.user = response.data as User;
      localStorage.setItem('user', JSON.stringify(response.data));
    },

    // Aktualizace uživatele (jméno, příjmení, přezdívka, heslo)
    async updateUser(firstName: string, lastName: string, nickname: string, password: string) {
      if (!this.user) {
        throw new Error('User is not logged in');
      }

      const response = await axios.put(
          '/api/user/update',
          { firstName, lastName, nickname, password },
          {
            headers: {
              Authorization: `Bearer ${this.user.token}`,
            },
          }
      );

      // Aktualizujeme stav uživatele
      this.user = { ...this.user, firstName, lastName, nickname };
      localStorage.setItem('user', JSON.stringify(this.user));
    },

    // Smazání účtu
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

    // Odhlášení uživatele
    logout() {
      this.user = null;
      localStorage.removeItem('user');
      window.location.href = '/login';
    },

    // Inicializace uživatele při načtení stránky
    initialize() {
      const user = localStorage.getItem('user');
      if (user) {
        this.user = JSON.parse(user) as User;
      } else {
        this.user = null; // Explicitně nastavte na null, pokud uživatel není přihlášen
      }
    },

    // Pomocná funkce pro zobrazení jména (přezdívka nebo email)
    getDisplayName(): string {
      if (!this.user) return '';
      return this.user.nickname || this.user.email;
    },
  },
});