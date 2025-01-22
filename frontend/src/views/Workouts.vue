<template>
  <v-container>
    <h2 class="text-h4 mb-4">Workouts</h2>
    <v-progress-circular v-if="loading" indeterminate color="primary"></v-progress-circular>
    <v-list v-else-if="workouts.length > 0">
      <v-list-item v-for="workout in workouts" :key="workout._id">
        <v-card class="mb-4">
          <v-card-title>{{ workout.title }}</v-card-title>
          <v-card-text>
            <p><strong>Load (kg): </strong>{{ workout.load }}</p>
            <p><strong>Reps: </strong>{{ workout.reps }}</p>
            <p>{{ formatDate(workout.createdAt) }}</p>
          </v-card-text>
          <v-card-actions>
            <v-btn color="error" @click="handleDelete(workout._id)">Delete</v-btn>
          </v-card-actions>
        </v-card>
      </v-list-item>
    </v-list>
    <p v-else>No workouts found.</p>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue'; // Přidejte computed
import { useWorkoutStore } from '../stores/workoutStore';
import { formatDistanceToNow } from 'date-fns';

export default defineComponent({
  name: 'Workouts',
  setup() {
    const workoutStore = useWorkoutStore();
    const loading = ref(true);

    // Načtěte workouty při prvním načtení stránky
    onMounted(async () => {
      await workoutStore.fetchWorkouts();
      loading.value = false;
    });

    // Formátování data
    const formatDate = (date: string) => {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    };

    // Smazání workoutu
    const handleDelete = async (id: string) => {
      try {
        loading.value = true; // Nastavte loading na true
        await workoutStore.deleteWorkout(id); // Smazání workoutu
      } catch (error) {
        console.error('Error deleting workout:', error);
      } finally {
        loading.value = false; // Nastavte loading zpět na false
      }
    };

    return {
      workouts: computed(() => workoutStore.workouts), // Použijte computed
      loading,
      formatDate,
      handleDelete,
    };
  },
});
</script>

<style scoped>
.workouts {
  padding: 20px;
}

.workout {
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
}
</style>