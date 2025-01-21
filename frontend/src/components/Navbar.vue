<!-- src/components/Navbar.vue -->
<template>
  <header>
    <div class="container">
      <router-link to="/">
        <h1>Workout Buddy</h1>
      </router-link>
      <nav>
        <div v-if="user">
          <span>{{ user.email }}</span>
          <button @click="handleLogout">Log out</button>
        </div>
        <div v-else>
          <router-link to="/login">Login</router-link>
          <router-link to="/signup">Signup</router-link>
        </div>
      </nav>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useAuthStore } from '../context/AuthContext';

export default defineComponent({
  setup() {
    const authStore = useAuthStore();
    const { user, logout } = authStore;

    const handleLogout = () => {
      logout();
    };

    return { user, handleLogout };
  },
});
</script>

<style scoped>
/* Stylování podle potřeby */
</style>
