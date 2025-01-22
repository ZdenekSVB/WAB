import { useWorkoutsStore } from '@/context/WorkoutContext';

export const useWorkouts = () => {
  const workoutsStore = useWorkoutsStore();
  if (!workoutsStore) {
    throw new Error('useWorkouts must be used within a Pinia store.');
  }
  return workoutsStore;
};
