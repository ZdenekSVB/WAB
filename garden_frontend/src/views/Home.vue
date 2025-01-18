<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title>Vítejte v Gardening Center</v-card-title>
          <v-card-subtitle>Prozkoumejte rostliny, tipy a další!</v-card-subtitle>
          <v-card-actions>
            <v-btn color="primary" to="/plants">Seznam rostlin</v-btn>
            <v-btn color="secondary" to="/tips">Seznam tipů</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
export default {
  name: 'Home',
};
</script>

<style scoped>
/* Můžeš přidat nějaké vlastní styly, pokud chceš */
</style>
