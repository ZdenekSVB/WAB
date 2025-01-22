<template>
  <v-container>
    <h2 class="text-h4 mb-4">Settings</h2>
    <v-form @submit.prevent="handleSubmit">
      <v-text-field v-model="email" label="Email"></v-text-field>
      <v-text-field v-model="password" label="New Password" type="password"></v-text-field>
      <v-btn type="submit" color="primary" :loading="isLoading">Save Changes</v-btn>
      <v-alert v-if="error" type="error" class="mt-4">{{ error }}</v-alert>
      <v-alert v-if="success" type="success" class="mt-4">{{ success }}</v-alert>
    </v-form>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useAuthStore } from '../stores/authStore';
import axios from 'axios';

export default defineComponent({
  name: 'Settings',
  setup() {
    const authStore = useAuthStore();
    const email = ref(authStore.user?.email || '');
    const password = ref('');
    const error = ref('');
    const success = ref('');
    const isLoading = ref(false);

    const handleSubmit = async () => {
      try {
        if (!authStore.user) {
          error.value = 'User is not authenticated';
          return;
        }

        isLoading.value = true;
        await authStore.updateUser(email.value, password.value);
        success.value = 'Settings updated successfully';
      } catch (err: any) {
        error.value = err.response?.data?.error || 'An error occurred';
      } finally {
        isLoading.value = false;
      }
    };

    return {
      email,
      password,
      error,
      success,
      isLoading,
      handleSubmit,
    };
  },
});
</script>