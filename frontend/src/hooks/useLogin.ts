// src/composables/useLogin.ts
import { ref } from 'vue';
import { useAuthStore } from '@/context/AuthContext';

export const useLogin = () => {
  const error = ref<string | null>(null);
  const isLoading = ref<boolean | null>(null);
  const authStore = useAuthStore();

  const login = async (email: string, password: string) => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await fetch('/api/user/login', {
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
      error.value = "Erorr";
    }
  };

  return { login, isLoading, error };
};
