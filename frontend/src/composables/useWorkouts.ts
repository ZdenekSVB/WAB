import { useWorkoutStore } from '../stores/plantStore';

export const useWorkouts = () => {
  const workoutStore = useWorkoutStore();
  return { workouts: workoutStore.workouts, fetchWorkouts: workoutStore.fetchWorkouts };
};
