<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title>Detail rostliny</v-card-title>
          <v-card-text>
            <p>ID: {{ id }}</p>
            <!-- Integrace s backendem pro detail rostliny -->
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'PlantDetail',
  computed: {
    // Použití route pro získání parametru id
    id(): string {
      const route = useRoute();

      // Oprava: typování params pro konkrétní routu
      const params = route.params as { id: string };  // Očekáváme, že id je řetězec
      return params.id;
    },
  },
});
</script>
