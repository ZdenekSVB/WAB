import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Import routeru
import { initializeKeycloak } from "@/plugins/keycloak";  // Import Keycloak konfigurace

// Inicializace aplikace Vue
const app = createApp(App);

// Inicializace Keycloak před spuštěním aplikace
initializeKeycloak().then(() => {
    // Pokud je autentizace úspěšná, přidáme router a spustíme aplikaci
    app.use(router);
    app.mount('#app');
}).catch((error) => {
    console.error("Chyba při autentizaci přes Keycloak:", error);
    // Zde můžete přesměrovat na chybovou stránku nebo přihlašovací stránku, pokud autentizace selže
});
