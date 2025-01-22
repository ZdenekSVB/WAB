<template>
  <v-card class="mx-auto my-8" max-width="500">
    <v-card-title>Add a New Workout</v-card-title>
    <v-card-text>
      <v-form @submit.prevent="handleSubmit">
        <v-text-field
            v-model="title"
            label="Exercise Title"
            :error-messages="emptyFields.includes('title') ? 'This field is required' : ''"
        ></v-text-field>
        <v-text-field
            v-model="load"
            label="Load (kg)"
            type="number"
            :error-messages="emptyFields.includes('load') ? 'This field is required' : ''"
        ></v-text-field>
        <v-text-field
            v-model="reps"
            label="Reps"
            type="number"
            :error-messages="emptyFields.includes('reps') ? 'This field is required' : ''"
        ></v-text-field>
        <v-btn type="submit" color="primary" :loading="isLoading">Add Workout</v-btn>
        <v-alert v-if="error" type="error" class="mt-4">{{ error }}</v-alert>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useWorkoutStore } from '../stores/workoutStore';
import { useAuthStore } from '../stores/authStore';

export default defineComponent({
  name: 'WorkoutForm',
  emits: ['workout-added'],
  setup(props, { emit }) {
    const title = ref('');
    const load = ref('');
    const reps = ref('');
    const error = ref<string | null>(null);
    const emptyFields = ref<string[]>([]);
    const isLoading = ref(false);
    const workoutStore = useWorkoutStore();
    const authStore = useAuthStore();

    const handleSubmit = async () => {
      if (!authStore.user) {
        error.value = 'You must be logged in';
        return;
      }

      const workout = {
        title: title.value,
        load: parseFloat(load.value),
        reps: parseInt(reps.value),
      };

      try {
        isLoading.value = true;
        await workoutStore.createWorkout(workout);
        emit('workout-added');
        title.value = '';
        load.value = '';
        reps.value = '';
        error.value = null;
        emptyFields.value = [];
      } catch (err: any) {
        error.value = err.response?.data?.error || 'An error occurred';
        emptyFields.value = err.response?.data?.emptyFields || [];
      } finally {
        isLoading.value = false;
      }
    };

    return {
      title,
      load,
      reps,
      error,
      emptyFields,
      isLoading,
      handleSubmit,
    };
  },
});
</script>