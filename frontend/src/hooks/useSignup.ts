import { ref } from 'vue';
import { useAuthStore } from '@/context/AuthContext';

export const useSignup = () => {
  const error = ref<string | null>(null);
  const isLoading = ref<boolean>(false);
  const authStore = useAuthStore();

  const signup = async (email: string, password: string) => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await fetch('http://localhost:4000/api/user/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const json = await response.json();

      if (!response.ok) {
        isLoading.value = false;
        error.value = json.error;
        return;
      }

      localStorage.setItem('user', JSON.stringify(json));
      authStore.setUser(json);
      isLoading.value = false;
    } catch (err) {
      isLoading.value = false;
      error.value = "An error occurred during signup.";
    }
  };

  return { signup, isLoading, error };
};
