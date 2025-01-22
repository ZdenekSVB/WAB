<template>
  <div class="home">
    <h2>Welcome to Workout Buddy</h2>
    <p>You are logged in as {{ user?.email }}.</p>
    <router-link to="/workouts">View Workouts</router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useAuthStore } from '../stores/authStore';

export default defineComponent({
  name: 'Home',
  setup() {
    const authStore = useAuthStore();

    return {
      user: authStore.user,
    };
  },
});
</script>

<style scoped>
.home {
  padding: 20px;
  text-align: center;
}

a {
  color: #42b983;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>