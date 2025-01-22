<template>
  <div class="edit-plant">
    <h2>Edit Plant</h2>
    <PlantForm :plantId="plantId" @plant-added="handlePlantAdded" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import PlantForm from '../components/PlantForm.vue';

export default defineComponent({
  name: 'EditPlant',
  components: {
    PlantForm,
  },
  setup() {
    const route = useRoute();
    const plantId = ref(route.params.id as string); // Získání ID rostliny z URL

    const handlePlantAdded = () => {
      // Přesměrování na seznam rostlin po úspěšné úpravě
      window.location.href = '/plants';
    };

    return {
      plantId,
      handlePlantAdded,
    };
  },
});
</script>

<style scoped>
.edit-plant {
  padding: 20px;
  text-align: center;
}
</style>