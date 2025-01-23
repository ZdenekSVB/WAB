<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Sign Up</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form @submit.prevent="handleSubmit">
              <!-- Povinné pole: Email -->
              <v-text-field
                  v-model="email"
                  label="Email"
                  type="email"
                  required
                  outlined
              ></v-text-field>

              <!-- Povinné pole: Heslo -->
              <v-text-field
                  v-model="password"
                  label="Password"
                  type="password"
                  required
                  outlined
              ></v-text-field>

              <!-- Volitelné pole: Jméno -->
              <v-text-field
                  v-model="firstName"
                  label="First Name"
                  outlined
              ></v-text-field>

              <!-- Volitelné pole: Příjmení -->
              <v-text-field
                  v-model="lastName"
                  label="Last Name"
                  outlined
              ></v-text-field>

              <!-- Volitelné pole: Přezdívka -->
              <v-text-field
                  v-model="nickname"
                  label="Nickname"
                  outlined
              ></v-text-field>

              <!-- Tlačítko pro registraci -->
              <v-btn
                  type="submit"
                  color="primary"
                  block
                  :disabled="isLoading"
              >
                {{ isLoading ? 'Signing up...' : 'Sign up' }}
              </v-btn>

              <!-- Chybová zpráva -->
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
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';

export default defineComponent({
  name: 'Signup',
  setup() {
    const email = ref('');
    const password = ref('');
    const firstName = ref('');
    const lastName = ref('');
    const nickname = ref('');
    const error = ref<string | null>(null);
    const isLoading = ref(false);
    const authStore = useAuthStore();
    const router = useRouter();

    const handleSubmit = async () => {
      isLoading.value = true;
      error.value = null;

      try {
        await authStore.signup(
            email.value,
            password.value,
            firstName.value,
            lastName.value,
            nickname.value
        );
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
      firstName,
      lastName,
      nickname,
      error,
      isLoading,
      handleSubmit,
    };
  },
});
</script>