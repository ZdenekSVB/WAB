<template>
  <v-container>
    <h2 class="text-h4 mb-4">My Plants</h2>
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
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="handleEdit(plant._id)" class="mr-2">Edit</v-btn>
            <v-btn color="error" @click="handleDelete(plant._id)">Delete</v-btn>
          </v-card-actions>
        </v-card>
      </v-list-item>
    </v-list>
    <p v-else>No plants found.</p>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';

export default defineComponent({
  name: 'MyPlants',
  setup() {
    const router = useRouter();
    const plants = ref<any[]>([]);
    const loading = ref(true);

    onMounted(async () => {
      await fetchPlants();
      loading.value = false;
    });

    const fetchPlants = async () => {
      try {
        const response = await axios.get('/api/plants/my-plants');
        plants.value = response.data;
      } catch (error) {
        console.error('Error fetching plants:', error);
      }
    };

    const formatDate = (date: string) => {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    };

    const handleEdit = (id: string) => {
      router.push(`/edit-plant/${id}`);
    };

    const handleDelete = async (id: string) => {
      try {
        await axios.delete(`/api/plants/${id}`);
        await fetchPlants(); // Obnov seznam rostlin po smazání
      } catch (error) {
        console.error('Error deleting plant:', error);
      }
    };

    return {
      plants,
      loading,
      formatDate,
      handleEdit,
      handleDelete,
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