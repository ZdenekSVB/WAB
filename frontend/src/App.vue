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

export default defineComponent({
  name: 'App',
  components: {
    Navbar,
  },
  setup() {
    const authStore = useAuthStore();

    // Inicializace uživatele při spuštění aplikace
    onMounted(() => {
      authStore.initialize();
    });

    return {};
  },
});
</script>