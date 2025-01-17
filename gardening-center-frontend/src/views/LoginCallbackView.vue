<template>
  <div>
    <h1>Callback</h1>
    <p v-if="auth.error">{{ auth.error }}</p>
    <p v-if="auth.state.authenticated">Welcome, {{ auth.getUsername() }}!</p>
    <p>
      <router-link to="/">Go to aircrafts</router-link>
    </p>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '@/composables/useAuth';
import { onMounted } from 'vue';

const auth = useAuth();

onMounted(async () => {
  const currentUrl = window.location.href;
  await auth.handleCallback(currentUrl);
});
</script>
