<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title>Detail rostliny</v-card-title>
          <v-card-text>
            <p>ID: {{ $route.params.id }}</p>
            <!-- Integrace s backendem pro detail rostliny -->
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
export default {
  name: 'PlantDetail',
};
</script>
