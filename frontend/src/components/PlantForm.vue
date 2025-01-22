<template>
  <v-card class="mx-auto my-8" max-width="500">
    <v-card-title>{{ isEditMode ? 'Edit Plant' : 'Add a New Plant' }}</v-card-title>
    <v-card-text>
      <v-form @submit.prevent="handleSubmit">
        <v-text-field
            v-model="name"
            label="Plant Name"
            :error-messages="emptyFields.includes('name') ? 'This field is required' : ''"
        ></v-text-field>
        <v-text-field
            v-model="species"
            label="Species"
            :error-messages="emptyFields.includes('species') ? 'This field is required' : ''"
        ></v-text-field>
        <v-text-field
            v-model="wateringFrequency"
            label="Watering Frequency (days)"
            type="number"
            :error-messages="emptyFields.includes('wateringFrequency') ? 'This field is required' : ''"
        ></v-text-field>

        <!-- Tlačítko pro nahrání obrázku -->
        <v-btn
            color="primary"
            class="mb-4"
            @click="triggerFileInput"
        >
          Upload Image
        </v-btn>
        <input
            ref="fileInput"
            type="file"
            accept="image/*"
            style="display: none"
            @change="handleImageUpload"
        />

        <!-- Náhled obrázku -->
        <v-img
            v-if="imagePreview"
            :src="imagePreview"
            max-height="200"
            contain
            class="mb-4"
        ></v-img>

        <!-- Tlačítka pod sebou -->
        <v-btn
            type="submit"
            color="primary"
            :loading="isLoading"
            block
            class="mb-2"
        >
          {{ isEditMode ? 'Save Changes' : 'Add Plant' }}
        </v-btn>
        <v-alert v-if="error" type="error" class="mt-4">{{ error }}</v-alert>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { usePlantStore } from '../stores/plantStore';
import { useAuthStore } from '../stores/authStore';
import { useRouter, useRoute } from 'vue-router';

export default defineComponent({
  name: 'PlantForm',
  props: {
    plantId: {
      type: String,
      required: false,
    },
  },
  emits: ['plant-added'],
  setup(props, { emit }) {
    const name = ref('');
    const species = ref('');
    const wateringFrequency = ref('');
    const imageFile = ref<File | null>(null);
    const imagePreview = ref<string | null>(null);
    const error = ref<string | null>(null);
    const emptyFields = ref<string[]>([]);
    const isLoading = ref(false);
    const plantStore = usePlantStore();
    const authStore = useAuthStore();
    const router = useRouter();
    const route = useRoute();
    const fileInput = ref<HTMLInputElement | null>(null);

    const isEditMode = ref(!!props.plantId);

    // Načtení dat rostliny pro úpravu
    onMounted(async () => {
      if (isEditMode.value && props.plantId) {
        const plant = plantStore.plants.find((p) => p._id === props.plantId);
        if (plant) {
          name.value = plant.name;
          species.value = plant.species;
          wateringFrequency.value = plant.wateringFrequency.toString();
          imagePreview.value = plant.imageUrl || null;
        }
      }
    });

    // Otevření dialogu pro výběr souboru
    const triggerFileInput = () => {
      if (fileInput.value) {
        fileInput.value.click();
      }
    };

    // Nahrání obrázku a převod na Base64
    const handleImageUpload = (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        const file = target.files[0];
        if (file.size > 5 * 1024 * 1024) { // 5 MB
          error.value = 'Image size must be less than 5 MB';
          return;
        }
        const reader = new FileReader();
        reader.onload = () => {
          imagePreview.value = reader.result as string; // Uložení Base64 řetězce
        };
        reader.readAsDataURL(file);
      }
    };

    const handleSubmit = async () => {
      if (!authStore.user) {
        error.value = 'You must be logged in';
        return;
      }

      const plantData = {
        name: name.value,
        species: species.value,
        wateringFrequency: parseInt(wateringFrequency.value),
        imageUrl: imagePreview.value, // Base64 řetězec
      };

      try {
        isLoading.value = true;
        if (isEditMode.value && props.plantId) {
          await plantStore.updatePlant(props.plantId, plantData);
        } else {
          await plantStore.createPlant(plantData);
        }
        emit('plant-added');
        router.push('/plants');
      } catch (err: any) {
        error.value = err.response?.data?.error || 'An error occurred';
        emptyFields.value = err.response?.data?.emptyFields || [];
      } finally {
        isLoading.value = false;
      }
    };

    return {
      name,
      species,
      wateringFrequency,
      imageFile,
      imagePreview,
      error,
      emptyFields,
      isLoading,
      isEditMode,
      fileInput,
      triggerFileInput,
      handleImageUpload,
      handleSubmit,
    };
  },
});
</script>