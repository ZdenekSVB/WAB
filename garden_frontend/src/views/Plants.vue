<template>
  <v-container>
    <v-row>
      <v-col v-for="plant in plants" :key="plant.id" cols="12" md="4">
        <v-card>
          <v-card-title>{{ plant.name }}</v-card-title>
          <v-card-actions>
            <v-btn :to="`/plants/${plant.id}`" color="primary">Detail</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
export default {
  name: 'Plants',
  data() {
    return {
      plants: [
        { id: 1, name: 'Monstera' },
        { id: 2, name: 'Ficus' },
      ],
    };
  },
};
</script>
