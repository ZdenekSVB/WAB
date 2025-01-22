import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  define: {
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false', // Přidejte tuto řádku
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:4000', // Adresa vašeho backendu
        changeOrigin: true,
        secure: false,
      },
    },
  },
});