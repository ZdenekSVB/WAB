// vite.config.ts
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            "@": "/src",
        },
    },
    server: {
        proxy: {
            "/auth": "http://localhost:5000",  // Směrujte na backend, který obsluhuje Keycloak
            "/plants": "http://localhost:5000",
            "/tips": "http://localhost:5000",
        },
    },
});
