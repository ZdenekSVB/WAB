<template>
  <v-app>
    <Navbar />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import Navbar from './components/Navbar.vue';
import { useAuthStore } from './stores/authStore';
import { useThemeStore } from './stores/themeStore';
import './assets/global.css'; // Import globálního CSS

export default defineComponent({
  name: 'App',
  components: {
    Navbar,
  },
  setup() {
    const authStore = useAuthStore();
    const themeStore = useThemeStore();

    // Inicializace uživatele a tématu při spuštění aplikace
    onMounted(() => {
      authStore.initialize();
      themeStore.initializeTheme(); // Inicializace tématu
    });

    return {};
  },
});
</script>