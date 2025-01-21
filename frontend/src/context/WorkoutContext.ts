// src/types/workout.ts
export interface Workout {
  _id: string;
  title: string;
  load: number;
  reps: number;
  createdAt: string;
  updatedAt?: string;
}

// src/stores/workouts.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { Workout } from '../types/workout';

export const useWorkoutsStore = defineStore('workouts', () => {
  const workouts = ref<Workout[]>([]);

  const fetchWorkouts = async (token: string) => {
    const response = await fetch('/api/workouts', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    workouts.value = response.ok ? data : [];
  };

  const createWorkout = async (workout: Workout, token: string, error, emptyFields) => {
    const response = await fetch('/api/workouts', {
      method: 'POST',
      body: JSON.stringify(workout),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();

    if (!response.ok) {
      error.value = data.error;
      emptyFields.value = data.emptyFields;
    } else {
      workouts.value.unshift(data);
    }
  };

  const deleteWorkout = async (id: string, token: string) => {
    const response = await fetch(`/api/workouts/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();

    if (response.ok) {
      workouts.value = workouts.value.filter((w) => w._id !== data._id);
    }
  };

  return { workouts, fetchWorkouts, createWorkout, deleteWorkout };
});
