import { defineStore } from "pinia";
import axios from "axios";

export const useProductStore = defineStore("products", {
  state: () => ({
    products: [] as { id: string; name: string; price: number }[],
  }),
  actions: {
    async fetchProducts() {
      const response = await axios.get("/api/products");
      this.products = response.data;
    },
  },
});
