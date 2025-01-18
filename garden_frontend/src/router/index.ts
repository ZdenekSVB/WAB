import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import Login from '@/views/Login.vue';
import Register from '@/views/Register.vue';
import Plants from '@/views/Plants.vue';
import PlantDetail from '@/views/PlantDetail.vue';
import Tips from '@/views/Tips.vue';
import AddTip from '@/views/AddTip.vue';
import keycloak from '@/plugins/keycloak'; // Import Keycloak pro ochranu route

import type { RouteRecordRaw, RouteLocationNormalized, NavigationGuardNext } from 'vue-router';

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'Home', component: Home }, // Veřejná stránka
  { path: '/login', name: 'Login', component: Login }, // Veřejná stránka
  { path: '/register', name: 'Register', component: Register }, // Veřejná stránka
  {
    path: '/plants',
    name: 'Plants',
    component: Plants,
    beforeEnter: protectRoute // Chráněná route
  },
  {
    path: '/plants/:id',
    name: 'PlantDetail',
    component: PlantDetail,
    beforeEnter: protectRoute // Chráněná route
  },
  {
    path: '/tips',
    name: 'Tips',
    component: Tips,
    beforeEnter: protectRoute // Chráněná route
  },
  {
    path: '/tips/add',
    name: 'AddTip',
    component: AddTip,
    beforeEnter: protectRoute // Chráněná route
  },
];

// Funkce pro ochranu chráněných cest
function protectRoute(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
  if (keycloak.authenticated) {
    next(); // Pokračuj, pokud je uživatel přihlášen
  } else {
    keycloak.login({ redirectUri: window.location.origin + to.fullPath }); // Přesměrování na Keycloak login
  }
}

// Vytvoření routeru
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Zpracování chyb dynamického importu
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (!localStorage.getItem('vuetify:dynamic-reload')) {
      console.warn('Dynamický import selhal, stránka bude znovu načtena');
      localStorage.setItem('vuetify:dynamic-reload', 'true');
      location.assign(to.fullPath); // Načte stránku znovu
    } else {
      console.error('Dynamický import selhal, opětovné načtení stránky problém nevyřešilo:', err);
    }
  } else {
    console.error('Chyba routeru:', err);
  }
});

// Odstranění flagu z localStorage po úspěšném načtení aplikace
router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload');
});

export default router;
