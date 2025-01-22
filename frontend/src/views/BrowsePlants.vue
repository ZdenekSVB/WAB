<template>
  <v-container>
    <h2 class="text-h4 mb-4">Browse Plants</h2>
    <v-progress-circular v-if="loading" indeterminate color="primary"></v-progress-circular>
    <v-list v-else-if="plants.length > 0">
      <v-list-item v-for="plant in plants" :key="plant._id">
        <v-card class="mb-4">
          <v-card-title>{{ plant.name }}</v-card-title>
          <v-card-text>
            <p><strong>Species:</strong> {{ plant.species }}</p>
            <p><strong>Watering Frequency (days):</strong> {{ plant.wateringFrequency }}</p>
            <v-img
                v-if="plant.imageUrl"
                :src="plant.imageUrl"
                max-height="200"
                contain
                class="mb-4"
                style="max-width: 100%; height: auto;"
            ></v-img>
            <p><strong>Added:</strong> {{ formatDate(plant.createdAt) }}</p>
            <p><strong>Likes:</strong> {{ plant.likes || 0 }}</p>
            <v-btn
                v-if="plant.user_id !== authStore.user?._id"
                color="primary"
                @click="likePlant(plant._id)"
            >
              Like
            </v-btn>
          </v-card-text>
        </v-card>
      </v-list-item>
    </v-list>
    <p v-else>No plants found.</p>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/authStore';
import { formatDistanceToNow } from 'date-fns';
import api from '../utils/api'; // Použij upravenou instanci axios

export default defineComponent({
  name: 'BrowsePlants',
  setup() {
    const authStore = useAuthStore();
    const plants = ref<any[]>([]);
    const loading = ref(true);

    onMounted(async () => {
      await fetchPlants();
      loading.value = false;
    });

    const fetchPlants = async () => {
      try {
        const response = await api.get('/plants/all-plants'); // Použij `api` místo `axios`
        plants.value = response.data;
      } catch (error) {
        console.error('Error fetching plants:', error);
      }
    };

    const formatDate = (date: string) => {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    };

    const likePlant = async (plantId: string) => {
      try {
        await api.post(`/plants/like/${plantId}`); // Použij `api` místo `axios`
        await fetchPlants(); // Obnov seznam rostlin po lajkování
      } catch (error) {
        console.error('Error liking plant:', error);
      }
    };

    return {
      plants,
      loading,
      formatDate,
      likePlant,
      authStore,
    };
  },
});
</script>

<style scoped>
.plants {
  padding: 20px;
}

.plant {
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
}

.v-card {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.v-img {
  display: block;
  margin-left: 0;
  margin-right: 0;
}
</style>