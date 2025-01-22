<template>
  <form class="signup" @submit.prevent="handleSubmit">
    <h3>Sign Up</h3>

    <label>Email address:</label>
    <input
      type="email"
      v-model="email"
    />
    <label>Password:</label>
    <input
      type="password"
      v-model="password"
    />

    <button :disabled="isLoading">Sign up</button>
    <div v-if="error" class="error">{{ error }}</div>
  </form>
</template>

<script>
import { ref } from 'vue';
import { useSignup } from '@/hooks/useSignup'; // Ujistěte se, že cesta je správná

export default {
  setup() {
    const email = ref('');
    const password = ref('');
    const { signup, error, isLoading } = useSignup();

    const handleSubmit = async () => {
      await signup(email.value, password.value);
    };

    return {
      email,
      password,
      signup,
      error,
      isLoading,
      handleSubmit,
    };
  },
};
</script>

<style scoped>
/* Vaše styly */
</style>
