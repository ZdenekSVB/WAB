import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Import routeru
import { initializeKeycloak } from "@/plugins/keycloak";  // Import Keycloak konfigurace

// Inicializace Keycloak před spuštěním aplikace
initializeKeycloak().then(() => {
    const app = createApp(App);

    // Použití routeru
    app.use(router);

    // Připojení aplikace
    app.mount('#app');
}).catch((error) => {
    console.error("Chyba při autentizaci přes Keycloak:", error);
    // Zde můžete přesměrovat na chybovou stránku nebo přihlašovací stránku
});
