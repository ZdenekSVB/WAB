<template>
  <div class="add-plant">
    <h2>Add a New Plant</h2>
    <PlantForm @plant-added="handlePlantAdded" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import PlantForm from '../components/PlantForm.vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'AddPlant',
  components: {
    PlantForm,
  },
  setup() {
    const router = useRouter();

    const handlePlantAdded = () => {
      router.push('/plants');
    };

    return {
      handlePlantAdded,
    };
  },
});
</script>

<style scoped>
.add-plant {
  padding: 20px;
  text-align: center;
}
</style>