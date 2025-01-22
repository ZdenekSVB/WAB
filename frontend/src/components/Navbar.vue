<template>
  <v-app-bar color="primary" dark>
    <v-toolbar-title>
      <router-link to="/" class="text-white text-decoration-none">
        Garden Buddy <!-- Změna názvu aplikace -->
      </router-link>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <div v-if="user">
      <v-btn text @click="$router.push('/plants')">Plants</v-btn> <!-- Změna z Workouts na Plants -->
      <v-btn text @click="$router.push('/add-plant')">Add Plant</v-btn> <!-- Změna z Add Workout na Add Plant -->
      <v-btn text @click="handleLogout">Logout</v-btn>
      <span class="ml-4">{{ user.email }}</span> <!-- Zobrazí e-mail uživatele -->
    </div>
    <div v-else>
      <v-btn text @click="$router.push('/login')">Login</v-btn>
      <v-btn text @click="$router.push('/signup')">Signup</v-btn>
    </div>
  </v-app-bar>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { useAuthStore } from '../stores/authStore';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'Navbar',
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();
    const user = ref(authStore.user);

    // Sledujte změny v authStore.user
    watch(
        () => authStore.user,
        (newUser) => {
          user.value = newUser;
        }
    );

    const handleLogout = () => {
      authStore.logout();
      router.push('/login'); // Přesměrování na přihlašovací stránku po odhlášení
    };

    return {
      user,
      handleLogout,
    };
  },
});
</script>

<style scoped>
.text-decoration-none {
  text-decoration: none;
}

.text-white {
  color: white;
}

.ml-4 {
  margin-left: 16px;
}
</style>