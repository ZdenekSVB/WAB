import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';
import { useAuthStore } from './authStore';

interface Workout {
  _id: string;
  title: string;
  reps: number;
  load: number;
  createdAt: string;
}

export const useWorkoutStore = defineStore('workout', () => {
  const workouts = ref<Workout[]>([]);
  const authStore = useAuthStore();

  const fetchWorkouts = async () => {
    try {
      const response = await axios.get('/api/workouts', {
        headers: { Authorization: `Bearer ${authStore.user?.token}` },
      });
      workouts.value = response.data; // Přepíšeme aktuální seznam
    } catch (error) {
      console.error('Error fetching workouts:', error);
    }
  };

  const createWorkout = async (workout: Omit<Workout, '_id' | 'createdAt'>) => {
    try {
      const response = await axios.post('/api/workouts', workout, {
        headers: { Authorization: `Bearer ${authStore.user?.token}` },
      });
      workouts.value = [response.data, ...workouts.value];
    } catch (error) {
      console.error('Error creating workout:', error);
    }
  };

  const deleteWorkout = async (id: string) => {
    try {
      await axios.delete(`/api/workouts/${id}`, {
        headers: { Authorization: `Bearer ${authStore.user?.token}` },
      });
      // Aktualizace seznamu v Pinia store
      workouts.value = workouts.value.filter((workout) => workout._id !== id);
    } catch (error) {
      console.error('Error deleting workout:', error);
      throw error; // Propagujte chybu, aby ji komponenta mohla řešit
    }
  };


  return { workouts, fetchWorkouts, createWorkout, deleteWorkout };
});