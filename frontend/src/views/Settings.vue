<template>
  <v-container>
    <h2 class="text-h4 mb-4">Settings</h2>
    <v-form @submit.prevent="handleSubmit">
      <!-- Email field je read-only -->
      <v-text-field
          v-model="email"
          label="Email"
          readonly
          outlined
          disabled
      ></v-text-field>

      <!-- Pole pro nové heslo -->
      <v-text-field
          v-model="password"
          label="New Password"
          type="password"
          outlined
      ></v-text-field>

      <!-- Tlačítko pro uložení změn -->
      <v-btn type="submit" color="primary" :loading="isLoading">Save Changes</v-btn>

      <!-- Zobrazení chyb a úspěšných zpráv -->
      <v-alert v-if="error" type="error" class="mt-4">{{ error }}</v-alert>
      <v-alert v-if="success" type="success" class="mt-4">{{ success }}</v-alert>
    </v-form>

    <!-- Tlačítko pro smazání účtu -->
    <v-btn color="error" class="mt-4" @click="handleDeleteAccount">Delete Account</v-btn>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useAuthStore } from '../stores/authStore';

export default defineComponent({
  name: 'Settings',
  setup() {
    const authStore = useAuthStore();
    const email = ref(authStore.user?.email || ''); // Email je pouze pro čtení
    const password = ref(''); // Pole pro nové heslo
    const error = ref(''); // Chybová zpráva
    const success = ref(''); // Úspěšná zpráva
    const isLoading = ref(false); // Načítací stav

    const handleSubmit = async () => {
      try {
        if (!authStore.user) {
          error.value = 'User is not authenticated';
          return;
        }

        isLoading.value = true;
        await authStore.updateUser(password.value); // Odesíláme pouze heslo
        success.value = 'Settings updated successfully';
        password.value = ''; // Vyčistíme pole pro heslo po úspěšné aktualizaci
      } catch (err: any) {
        error.value = err.response?.data?.error || 'An error occurred';
      } finally {
        isLoading.value = false;
      }
    };

    const handleDeleteAccount = async () => {
      if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
        try {
          await authStore.deleteUser();
          success.value = 'Account deleted successfully';
        } catch (err: any) {
          error.value = err.response?.data?.error || 'An error occurred';
        }
      }
    };

    return {
      email,
      password,
      error,
      success,
      isLoading,
      handleSubmit,
      handleDeleteAccount,
    };
  },
});
</script>