<!-- src/pages/Home.vue -->
<template>
  <div class="home">
    <div class="workouts">
      <WorkoutDetails
        v-for="workout in workouts"
        :key="workout._id"
        :workout="workout"
      />
    </div>
    <WorkoutForm />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import WorkoutDetails from '../components/WorkoutDetails.vue';
import WorkoutForm from '../components/WorkoutForm.vue';
import { useWorkoutsStore } from '../context/WorkoutContext';
import { useAuthStore } from '../context/AuthContext';

export default defineComponent({
  components: { WorkoutDetails, WorkoutForm },
  setup() {
    const workoutsStore = useWorkoutsStore();
    const authStore = useAuthStore();
    const { fetchWorkouts, workouts } = workoutsStore;

    onMounted(() => {
      if (authStore.user) {
        fetchWorkouts(authStore.user.token);
      }
    });

    return { workouts };
  },
});
</script>
