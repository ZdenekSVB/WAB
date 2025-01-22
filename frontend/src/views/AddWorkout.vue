<template>
  <div class="add-workout">
    <h2>Add a New Workout</h2>
    <WorkoutForm @workout-added="handleWorkoutAdded" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import WorkoutForm from '../components/WorkoutForm.vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'AddWorkout',
  components: {
    WorkoutForm,
  },
  setup() {
    const router = useRouter();

    const handleWorkoutAdded = () => {
      router.push('/workouts'); // Přesměrujte uživatele na seznam workoutů
    };

    return {
      handleWorkoutAdded,
    };
  },
});
</script>

<style scoped>
.add-workout {
  padding: 20px;
  text-align: center;
}
</style>