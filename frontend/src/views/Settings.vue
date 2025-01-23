<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-toolbar color="primary" dark>
            <v-toolbar-title>Settings</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <!-- Formulář pro úpravu informací -->
            <v-form @submit.prevent="handleSubmit">
              <!-- Pole pro jméno -->
              <v-text-field
                  v-model="firstName"
                  label="First Name"
                  outlined
              ></v-text-field>

              <!-- Pole pro příjmení -->
              <v-text-field
                  v-model="lastName"
                  label="Last Name"
                  outlined
              ></v-text-field>

              <!-- Pole pro přezdívku -->
              <v-text-field
                  v-model="nickname"
                  label="Nickname"
                  outlined
              ></v-text-field>

              <!-- Pole pro heslo -->
              <v-text-field
                  v-model="password"
                  label="New Password"
                  type="password"
                  outlined
              ></v-text-field>

              <!-- Tlačítko pro uložení změn -->
              <v-btn type="submit" color="primary" :loading="isLoading">
                Save Changes
              </v-btn>

              <!-- Chybová zpráva -->
              <v-alert v-if="error" type="error" class="mt-4">
                {{ error }}
              </v-alert>
            </v-form>

            <!-- Tlačítko pro přepínání dark/light mode -->
            <v-btn @click="toggleDarkMode" class="mt-4" color="secondary">
              {{ isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode' }}
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/authStore';
import { useThemeStore } from '../stores/themeStore';

export default defineComponent({
  name: 'Settings',
  setup() {
    const authStore = useAuthStore();
    const themeStore = useThemeStore();
    const firstName = ref('');
    const lastName = ref('');
    const nickname = ref('');
    const password = ref('');
    const error = ref<string | null>(null);
    const isLoading = ref(false);

    // Načtení aktuálních informací o uživateli
    onMounted(() => {
      if (authStore.user) {
        firstName.value = authStore.user.firstName || '';
        lastName.value = authStore.user.lastName || '';
        nickname.value = authStore.user.nickname || '';
      }
      themeStore.initializeTheme(); // Inicializace tématu
    });

    // Odeslání formuláře
    const handleSubmit = async () => {
      isLoading.value = true;
      error.value = null;

      try {
        await authStore.updateUser(
            firstName.value,
            lastName.value,
            nickname.value,
            password.value
        );
        alert('Changes saved successfully!');
      } catch (err: any) {
        error.value = err.message || 'An error occurred';
      } finally {
        isLoading.value = false;
      }
    };

    // Přepínání dark/light mode
    const toggleDarkMode = () => {
      themeStore.toggleDarkMode();
    };

    return {
      firstName,
      lastName,
      nickname,
      password,
      error,
      isLoading,
      handleSubmit,
      toggleDarkMode,
      isDarkMode: themeStore.isDarkMode,
    };
  },
});
</script>