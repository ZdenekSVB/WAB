<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Registrace</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="register">
              <v-text-field
                v-model="name"
                label="Jméno"
                required
                outlined
              />
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
              <v-btn type="submit" color="primary">Registrovat</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
export default {
  name: 'Register',
  data() {
    return {
      name: '',
      email: '',
      password: '',
    };
  },
  methods: {
    register() {
      console.log('Registruji uživatele:', this.name);
    },
  },
};
</script>
