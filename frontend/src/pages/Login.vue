<!-- src/pages/Login.vue -->
<template>
  <form class="login" @submit.prevent="handleSubmit">
    <h3>Log In</h3>
    <label>Email address:</label>
    <input type="email" v-model="email" />
    <label>Password:</label>
    <input type="password" v-model="password" />
    <button :disabled="isLoading">Log in</button>
    <div v-if="error" class="error">{{ error }}</div>
  </form>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useAuthStore } from '../context/AuthContext';

export default defineComponent({
  setup() {
    const email = ref('');
    const password = ref('');
    const authStore = useAuthStore();
    const { login, error, isLoading } = authStore;

    const handleSubmit = async () => {
      await login(email.value, password.value);
    };

    return { email, password, handleSubmit, error, isLoading };
  },
});
</script>
