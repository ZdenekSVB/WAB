import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import Vue from '@vitejs/plugin-vue';
import VueRouter from 'unplugin-vue-router/vite';
import Vuetify, { transformAssetUrls } from 'vite-plugin-vuetify';
import Components from 'unplugin-vue-components/vite';
import ViteFonts from 'unplugin-fonts/vite';

export default defineConfig({
  plugins: [
    VueRouter(), // Enable Vue Router
    Vue({
      template: { transformAssetUrls }, // Enable template asset URLs
    }),
    Vuetify({
      autoImport: true, // Auto-import Vuetify components
      styles: { configFile: 'src/styles/settings.scss' }, // Vuetify styles
    }),
    Components(), // Auto-import Vue components
    ViteFonts({
      google: {
        families: [
          {
            name: 'Roboto',
            styles: 'wght@100;300;400;500;700;900', // Load Roboto font
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)), // Alias for src directory
    },
  },
  server: {
    proxy: {
      '/api': 'http://localhost:4000', // Proxy API requests to backend
    },
  },
});
