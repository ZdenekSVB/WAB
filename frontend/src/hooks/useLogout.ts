
import { useAuthStore } from '@/context/AuthContext';
import { useWorkoutsStore } from '@/context/WorkoutContext';

export const useLogout = () => {
  const authStore = useAuthStore();
  const workoutsStore = useWorkoutsStore();

  const logout = () => {
    localStorage.removeItem('user');
    authStore.logout();
    workoutsStore.workouts([]);
  };

  return { logout };
};
