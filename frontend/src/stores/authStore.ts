import { defineStore } from 'pinia';
import axios from 'axios';

// Export the User interface
export interface User {
  _id: string; // Ensure this is included
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
    // Signup user
    async signup(
        email: string,
        password: string,
        firstName?: string,
        lastName?: string,
        nickname?: string
    ) {
      try {
        const response = await axios.post('/api/user/signup', {
          email,
          password,
          firstName,
          lastName,
          nickname,
        });
        this.user = response.data as User;
        localStorage.setItem('user', JSON.stringify(response.data));
      } catch (error: any) {
        // Extract the error message from the backend response
        const errorMessage = error.response?.data?.error || 'An error occurred during signup';
        throw new Error(errorMessage);
      }
    },

    // Login user
    async login(credentials: { email?: string; nickname?: string; password: string }) {
      try {
        const response = await axios.post('/api/user/login', credentials);
        this.user = {
          _id: response.data._id,
          email: response.data.email,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          nickname: response.data.nickname,
          token: response.data.token,
        };
        localStorage.setItem('user', JSON.stringify(this.user));
      } catch (error: any) {
        // Extract the error message from the backend response
        const errorMessage = error.response?.data?.error || 'An error occurred during login';
        throw new Error(errorMessage);
      }
    },
    // Update user
    async updateUser(firstName: string, lastName: string, nickname: string, password: string) {
      if (!this.user) {
        throw new Error('User is not logged in');
      }

      try {
        const response = await axios.put(
            '/api/user/update', // Correct endpoint
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
      } catch (error: any) {
        throw new Error(error.response?.data?.error || 'An error occurred during update');
      }
    },

    // Delete user
    async deleteUser() {
      if (!this.user) {
        throw new Error('User is not logged in');
      }

      try {
        await axios.delete('/user/delete', {
          headers: {
            Authorization: `Bearer ${this.user.token}`,
          },
        });
        this.user = null;
        localStorage.removeItem('user');
        window.location.href = '/login';
      } catch (error: any) {
        throw new Error(error.response?.data?.error || 'An error occurred during deletion');
      }
    },

    // Logout user
    logout() {
      this.user = null;
      localStorage.removeItem('user');
      window.location.href = '/login'; // Force a page reload to reset the state
    },

    // Initialize user from localStorage
    initialize() {
      const user = localStorage.getItem('user');
      if (user) {
        this.user = JSON.parse(user) as User;
        console.log('Initialized user:', this.user); // Debugging line
      } else {
        this.user = null;
      }
    },

    // Get user display name
    getDisplayName(): string {
      if (!this.user) return '';
      return this.user.nickname || this.user.email;
    },
  },
});