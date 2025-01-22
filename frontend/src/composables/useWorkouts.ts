import { useWorkoutStore } from '../stores/workoutStore';

export const useWorkouts = () => {
  const workoutStore = useWorkoutStore();
  return { workouts: workoutStore.workouts, fetchWorkouts: workoutStore.fetchWorkouts };
};
