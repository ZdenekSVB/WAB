import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Plants from '../views/Plants.vue';
import PlantDetail from '../views/PlantDetail.vue';
import Tips from '../views/Tips.vue';
import AddTip from '../views/AddTip.vue';

// Definice rout pro aplikaci
const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/plants', name: 'Plants', component: Plants },
  { path: '/plants/:id', name: 'PlantDetail', component: PlantDetail },
  { path: '/tips', name: 'Tips', component: Tips },
  { path: '/tips/add', name: 'AddTip', component: AddTip },
];

// Vytvoření instance routeru s historií
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),  // Použití BASE_URL pro správné načítání cest
  routes,  // Předání definovaných rout
});

// Chyby dynamického importu s Vuetify
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (!localStorage.getItem('vuetify:dynamic-reload')) {
      console.log('Reloading page to fix dynamic import error');
      localStorage.setItem('vuetify:dynamic-reload', 'true');
      location.assign(to.fullPath);
    } else {
      console.error('Dynamic import error, reloading page did not fix it', err);
    }
  } else {
    console.error(err);
  }
});

// Odstranění reload flagu z localStorage
router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload');
});

export default router;
