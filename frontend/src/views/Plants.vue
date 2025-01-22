<template>
  <v-container>
    <h2 class="text-h4 mb-4">Plants</h2>
    <v-progress-circular v-if="loading" indeterminate color="primary"></v-progress-circular>
    <v-list v-else-if="plants.length > 0">
      <v-list-item v-for="plant in plants" :key="plant._id">
        <v-card class="mb-4">
          <v-card-title>{{ plant.name }}</v-card-title>
          <v-card-text>
            <p><strong>Species:</strong> {{ plant.species }}</p>
            <p><strong>Watering Frequency (days):</strong> {{ plant.wateringFrequency }}</p>
            <!-- Obrázek zarovnaný vlevo -->
            <v-img
                v-if="plant.imageUrl"
                :src="plant.imageUrl"
                max-height="200"
                contain
                class="mb-4"
                style="max-width: 100%; height: auto;"
            ></v-img>
            <p><strong>Added:</strong> {{ formatDate(plant.createdAt) }}</p>
          </v-card-text>
          <v-card-actions>
            <!-- Tlačítka vedle sebe -->
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
import { defineComponent, ref, onMounted, computed } from 'vue';
import { usePlantStore } from '../stores/plantStore';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'Plants',
  setup() {
    const plantStore = usePlantStore();
    const router = useRouter();
    const loading = ref(true);

    // Načtěte rostliny při prvním načtení stránky
    onMounted(async () => {
      await plantStore.fetchPlants();
      loading.value = false;
    });

    // Formátování data
    const formatDate = (date: string) => {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    };

    // Smazání rostliny
    const handleDelete = async (id: string) => {
      try {
        loading.value = true;
        await plantStore.deletePlant(id);
      } catch (error) {
        console.error('Error deleting plant:', error);
      } finally {
        loading.value = false;
      }
    };

    // Úprava rostliny
    const handleEdit = (id: string) => {
      router.push(`/edit-plant/${id}`); // Přesměrování na stránku úprav
    };

    return {
      plants: computed(() => plantStore.plants),
      loading,
      formatDate,
      handleDelete,
      handleEdit,
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