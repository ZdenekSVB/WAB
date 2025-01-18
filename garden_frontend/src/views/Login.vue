<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Přihlášení</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="login">
              <v-text-field
                v-model="email"
                label="Email"
                type="email"
                required
                outlined
              />
              <v-text-field
                v-model="password"
                label="Heslo"
                type="password"
                required
                outlined
              />
              <v-btn type="submit" color="primary">Přihlásit</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: '',
    };
  },
  methods: {
    login() {
      console.log('Přihlašuji uživatele:', this.email);
    },
  },
};
</script>
