<template>
  <v-app-bar color="primary" dark>
    <v-toolbar-title>
      <router-link to="/" class="text-white text-decoration-none">
        Garden Buddy
      </router-link>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <div v-if="user">
      <v-btn text @click="$router.push('/plants')">My Plants</v-btn> <!-- Zobrazuje pouze rostliny uživatele -->
      <v-btn text @click="$router.push('/add-plant')">Add Plant</v-btn>
      <v-btn text @click="$router.push('/chat')">Chat</v-btn>
      <v-btn text @click="$router.push('/all-plants')">Browse Plants</v-btn> <!-- Zobrazuje všechny rostliny -->
      <v-btn text @click="handleLogout">Logout</v-btn>
      <v-btn text @click="$router.push('/settings')">{{ user.email }}</v-btn>
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

    // Sleduj změny v authStore.user
    watch(
        () => authStore.user,
        (newUser) => {
          user.value = newUser;
        }
    );

    // Odhlášení uživatele
    const handleLogout = () => {
      authStore.logout();
      router.push('/login');
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
</style>