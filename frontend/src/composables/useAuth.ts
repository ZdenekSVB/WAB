import { useAuthStore } from '../stores/authStore';

export const useAuth = () => {
  const authStore = useAuthStore();
  return { user: authStore.user };
};
