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
            <!-- Lajkování se znakem srdce -->
            <div class="d-flex align-center">
              <v-btn
                  icon
                  @click="toggleLike(plant)"
                  :disabled="!authStore.user || loadingLike"
              >
<span :style="{ color: plant.likedBy.includes(authStore.user?.email ?? '') ? 'red' : 'grey', fontSize: '36px' }">
  {{ plant.likedBy.includes(authStore.user?.email ?? '') ? '♥' : '♡' }}
</span>
              </v-btn>
              <span class="ml-2" style="font-size: 24px;">{{ plant.likes || 0 }}</span>
            </div>
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
import api from '../utils/api';

export default defineComponent({
  name: 'BrowsePlants',
  setup() {
    const authStore = useAuthStore();
    const plants = ref<any[]>([]);
    const loading = ref(true);
    const loadingLike = ref(false);

    onMounted(async () => {
      await fetchPlants();
      loading.value = false;
    });

    const fetchPlants = async () => {
      try {
        const response = await api.get('/plants/other-users-plants');
        plants.value = response.data.map((plant: any) => ({
          ...plant,
          likedBy: plant.likedBy || [], // Ensure likedBy is always an array
        }));
      } catch (error) {
        console.error('Error fetching plants:', error);
      }
    };

    const formatDate = (date: string) => {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    };

    const toggleLike = async (plant: any) => {
      if (loadingLike.value || !authStore.user) {
        console.error('User is not logged in or loadingLike is true');
        return;
      }
      loadingLike.value = true;

      try {
        const userEmail = authStore.user.email; // Používáme email místo _id
        if (!userEmail) {
          throw new Error('User email is undefined');
        }

        console.log('Toggling like for plant:', plant._id);
        console.log('Current likedBy:', plant.likedBy);
        console.log('Current user email:', userEmail);

        if (plant.likedBy.includes(userEmail)) {
          // Unlike the plant
          await api.post(`/plants/unlike/${plant._id}`);
          plant.likes -= 1;
          plant.likedBy = plant.likedBy.filter((email: string) => email !== userEmail);
        } else {
          // Like the plant
          await api.post(`/plants/like/${plant._id}`);
          plant.likes += 1;
          plant.likedBy.push(userEmail);
        }
      } catch (error: any) {
        if (error.response?.status === 400) {
          console.error('User has already liked this plant:', error.response.data.error);
        } else {
          console.error('Error toggling like:', error);
        }
      } finally {
        loadingLike.value = false;
      }
    };

    return {
      plants,
      loading,
      formatDate,
      toggleLike,
      authStore,
      loadingLike,
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