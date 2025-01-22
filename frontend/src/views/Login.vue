<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Log In</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form @submit.prevent="handleSubmit">
              <v-text-field
                  v-model="email"
                  label="Email"
                  type="email"
                  required
                  outlined
              ></v-text-field>
              <v-text-field
                  v-model="password"
                  label="Password"
                  type="password"
                  required
                  outlined
              ></v-text-field>
              <v-btn
                  type="submit"
                  color="primary"
                  block
                  :disabled="isLoading"
              >
                {{ isLoading ? 'Logging in...' : 'Log in' }}
              </v-btn>
              <v-alert v-if="error" type="error" class="mt-4">
                {{ error }}
              </v-alert>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useAuthStore } from '../stores/authStore';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'Login',
  setup() {
    const email = ref('');
    const password = ref('');
    const error = ref<string | null>(null);
    const isLoading = ref(false);
    const authStore = useAuthStore();
    const router = useRouter();

    const handleSubmit = async () => {
      isLoading.value = true;
      error.value = null;
      try {
        await authStore.login(email.value, password.value);
        router.push('/');
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
      isLoading,
      handleSubmit,
    };
  },
});
</script>