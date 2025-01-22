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
import { useAuthStore } from '@/context/AuthContext';

export default defineComponent({
  setup() {
    const email = ref('');
    const password = ref('');
    const authStore = useAuthStore();

    const handleSubmit = async () => {
      await authStore.login(email.value, password.value);
    };

    return { email, password, handleSubmit, error: authStore.error, isLoading: authStore.isLoading };
  },
});
</script>
