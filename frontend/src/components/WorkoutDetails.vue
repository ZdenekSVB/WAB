<!-- src/components/WorkoutDetails.vue -->
<template>
  <div class="workout-details">
    <h4>{{ workout.title }}</h4>
    <p><strong>Load (kg): </strong>{{ workout.load }}</p>
    <p><strong>Reps: </strong>{{ workout.reps }}</p>
    <p>{{ formattedDate }}</p>
    <span class="material-symbols-outlined" @click="handleClick">delete</span>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { formatDistanceToNow } from 'date-fns';
import { useAuthStore } from '@/context/AuthContext';
import { useWorkoutsStore } from '@/context/WorkoutContext';

export default defineComponent({
  props: {
    workout: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const authStore = useAuthStore();
    const workoutsStore = useWorkoutsStore();
    const { deleteWorkout } = workoutsStore;

    const formattedDate = computed(() =>
      formatDistanceToNow(new Date(props.workout.createdAt), { addSuffix: true })
    );

    const handleClick = async () => {
      if (!authStore.user) return;
      await deleteWorkout(props.workout._id, authStore.user.token);
    };

    return { formattedDate, handleClick };
  },
});
</script>
