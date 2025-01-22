<template>
  <div class="workout-details">
    <h4>{{ workout.title }}</h4>
    <p><strong>Load (kg): </strong>{{ workout.load }}</p>
    <p><strong>Reps: </strong>{{ workout.reps }}</p>
    <p>{{ formatDistanceToNow(new Date(workout.createdAt), { addSuffix: true }) }}</p>
    <span class="material-symbols-outlined" @click="handleClick">delete</span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { formatDistanceToNow } from 'date-fns';
import { useWorkoutStore } from '../stores/workoutStore';

export default defineComponent({
  name: 'WorkoutDetails',
  props: {
    workout: {
      type: Object as () => { _id: string; title: string; load: number; reps: number; createdAt: string },
      required: true,
    },
  },
  setup(props) {
    const workoutStore = useWorkoutStore();

    const handleClick = async () => {
      await workoutStore.deleteWorkout(props.workout._id);
    };

    return {
      formatDistanceToNow,
      handleClick,
    };
  },
});
</script>