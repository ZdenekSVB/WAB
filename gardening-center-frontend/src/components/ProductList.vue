<template>
  <div>
    <h2>Product List</h2>
    <ul>
      <li v-for="product in products" :key="product.id">
        {{ product.name }} - {{ product.price }}$
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import { useProductStore } from "../store/products";

export default defineComponent({
  setup() {
    const productStore = useProductStore();

    onMounted(() => {
      productStore.fetchProducts();
    });

    return {
      products: productStore.products,
    };
  },
});
</script>
