import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';
import { useAuthStore } from './authStore';

interface Plant {
  _id: string;
  name: string;
  species: string;
  wateringFrequency: number;
  imageUrl?: string;
  createdAt: string;
  likes: number; // Add this line
  likedBy: string[]; // Add this line
  user_id: string; // Add this line
}

export const usePlantStore = defineStore('plant', () => {
  const plants = ref<Plant[]>([]);
  const authStore = useAuthStore();

  const fetchPlants = async () => {
    try {
      const response = await axios.get('/api/plants', {
        headers: { Authorization: `Bearer ${authStore.user?.token}` },
      });
      plants.value = response.data;
    } catch (error) {
      console.error('Error fetching plants:', error);
    }
  };

  const createPlant = async (plant: Omit<Plant, '_id' | 'createdAt'>) => {
    try {
      const response = await axios.post('/api/plants', plant, {
        headers: { Authorization: `Bearer ${authStore.user?.token}` },
      });
      plants.value = [response.data, ...plants.value];
    } catch (error) {
      console.error('Error creating plant:', error);
      throw error;
    }
  };

  const updatePlant = async (id: string, plant: Partial<Plant>) => {
    try {
      const response = await axios.patch(`/api/plants/${id}`, plant, {
        headers: { Authorization: `Bearer ${authStore.user?.token}` },
      });
      const index = plants.value.findIndex((p) => p._id === id);
      if (index !== -1) {
        plants.value[index] = response.data;
      }
    } catch (error) {
      console.error('Error updating plant:', error);
      throw error;
    }
  };

  const deletePlant = async (id: string) => {
    try {
      await axios.delete(`/api/plants/${id}`, {
        headers: { Authorization: `Bearer ${authStore.user?.token}` },
      });
      plants.value = plants.value.filter((plant) => plant._id !== id);
    } catch (error) {
      console.error('Error deleting plant:', error);
      throw error;
    }
  };

  return { plants, fetchPlants, createPlant, updatePlant, deletePlant };
});