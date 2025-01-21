// src/composables/useAuth.ts
import { useAuthStore } from '../stores/auth';

export const useAuth = () => {
  const authStore = useAuthStore();
  if (!authStore) {
    throw new Error('useAuth must be used within a Pinia store.');
  }
  return authStore;
};
