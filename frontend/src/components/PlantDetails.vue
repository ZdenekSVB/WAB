<template>
  <div class="plant-details">
    <h4>{{ plant.name }}</h4>
    <p><strong>Species: </strong>{{ plant.species }}</p>
    <p><strong>Watering Frequency (days): </strong>{{ plant.wateringFrequency }}</p>
    <v-img
        v-if="plant.imageUrl"
        :src="plant.imageUrl"
        max-height="200"
        contain
        class="mb-4"
    ></v-img>
    <p>{{ formatDate(plant.createdAt) }}</p> <!-- Použití formatDate -->
    <v-btn color="primary" @click="handleEdit">Edit</v-btn>
    <v-btn color="error" @click="handleDelete">Delete</v-btn>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { formatDistanceToNow } from 'date-fns'; // Import funkce pro formátování data
import { usePlantStore } from '../stores/plantStore';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'PlantDetails',
  props: {
    plant: {
      type: Object as () => { _id: string; name: string; species: string; wateringFrequency: number; imageUrl?: string; createdAt: string },
      required: true,
    },
  },
  setup(props) {
    const plantStore = usePlantStore();
    const router = useRouter();

    // Funkce pro smazání rostliny
    const handleDelete = async () => {
      await plantStore.deletePlant(props.plant._id);
    };

    // Funkce pro úpravu rostliny
    const handleEdit = () => {
      router.push(`/edit-plant/${props.plant._id}`);
    };

    // Funkce pro formátování data
    const formatDate = (date: string) => {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    };

    return {
      formatDate, // Vrácení funkce do šablony
      handleDelete,
      handleEdit,
    };
  },
});
</script>

<style scoped>
.plant-details {
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
}
</style>