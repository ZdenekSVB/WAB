// src/composables/useLogout.ts
import { useAuthStore } from '../stores/auth';
import { useWorkoutsStore } from '../stores/workouts';

export const useLogout = () => {
  const authStore = useAuthStore();
  const workoutsStore = useWorkoutsStore();

  const logout = () => {
    localStorage.removeItem('user');
    authStore.logout();
    workoutsStore.setWorkouts([]);
  };

  return { logout };
};
