<template>
  <form class="create" @submit.prevent="handleSubmit">
    <h3>Add a New Workout</h3>
    <label>Exercise Title:</label>
    <input type="text" v-model="title" :class="{ error: emptyFields.includes('title') }" />
    <label>Load (in kg):</label>
    <input type="number" v-model="load" :class="{ error: emptyFields.includes('load') }" />
    <label>Reps:</label>
    <input type="number" v-model="reps" :class="{ error: emptyFields.includes('reps') }" />
    <button>Add Workout</button>
    <div v-if="error" class="error">{{ error }}</div>
  </form>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useWorkoutsStore } from '@/context/WorkoutContext';
import { useAuthStore } from '@/context/AuthContext';

interface WorkoutInput {
  title: string;
  load: number;
  reps: number;
}

export default defineComponent({
  setup() {
    const title = ref('');
    const load = ref<number | string>('');
    const reps = ref<number | string>('');
    const error = ref<string | null>(null);
    const emptyFields = ref<string[]>([]);
    const workoutsStore = useWorkoutsStore();
    const authStore = useAuthStore();

    const handleSubmit = async () => {
      if (!authStore.user) {
        error.value = 'You must be logged in';
        return;
      }

      const workout: WorkoutInput = {
        title: title.value,
        load: Number(load.value),
        reps: Number(reps.value),
      };

      await workoutsStore.createWorkout(
        workout,
        authStore.user.token,
        error,
        emptyFields
      );

      if (!error.value) {
        title.value = '';
        load.value = '';
        reps.value = '';
        emptyFields.value = [];
      }
    };

    return { title, load, reps, error, emptyFields, handleSubmit };
  },
});
</script>
