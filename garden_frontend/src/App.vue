<template>
  <v-app>
    <!-- Navigační lišta -->
    <v-app-bar app>
      <v-toolbar-title>Gardening Center</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn to="/login" color="primary">Přihlásit</v-btn>
      <v-btn to="/register" color="secondary">Registrace</v-btn>
    </v-app-bar>

    <!-- Hlavní obsah aplikace -->
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
// Tento soubor je použit pro hlavní aplikaci, není třeba zde nic specifického přidávat.
// Skript pro správné načtení komponent a zobrazení je již implementován.
</script>

<style scoped>
/* Můžete přidat vlastní styly pro vaši aplikaci */
</style>
