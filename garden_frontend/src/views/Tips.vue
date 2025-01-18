<template>
  <v-container>
    <v-row>
      <v-col v-for="tip in tips" :key="tip.id" cols="12" md="4">
        <v-card>
          <v-card-title>{{ tip.title }}</v-card-title>
          <v-card-actions>
            <v-btn color="primary">Detail</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-btn to="/tips/add" color="primary">Přidat tip</v-btn>
  </v-container>
</template>

<script lang="ts">
export default {
  name: 'Tips',
  data() {
    return {
      tips: [
        { id: 1, title: 'Zalévejte pravidelně' },
        { id: 2, title: 'Používejte hnojivo' },
      ],
    };
  },
};
</script>
