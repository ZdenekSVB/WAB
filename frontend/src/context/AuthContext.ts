import { defineStore } from 'pinia';
import { ref } from 'vue';

interface UserData {
  email: string;
  token: string;
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<UserData | null>(null);
  const isLoading = ref(false); // Add isLoading
  const error = ref<string | null>(null); // Add error

  async function login(email: string, password: string) {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await fetch('http://localhost:4000/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const json = await response.json();

      if (!response.ok) {
        error.value = json.error;
        return;
      }

      user.value = json;
      localStorage.setItem('user', JSON.stringify(json));
    } catch (err) {
      error.value = 'An error occurred during login.';
    } finally {
      isLoading.value = false;
    }
  }

  function logout() {
    user.value = null;
    localStorage.removeItem('user');
  }

  function setUser(userData: UserData) {
    user.value = userData;
  }

  return { user, isLoading, error, login, logout, setUser };
});
