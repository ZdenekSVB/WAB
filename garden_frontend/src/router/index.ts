import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import Login from '@/views/Login.vue';
import Register from '@/views/Register.vue';
import Plants from '@/views/Plants.vue';
import PlantDetail from '@/views/PlantDetail.vue';
import Tips from '@/views/Tips.vue';
import AddTip from '@/views/AddTip.vue';
import keycloak from '@/plugins/keycloak';  // Import Keycloak pro ochranu route

// Import typu RouteRecordRaw pouze jako typ
import type { RouteRecordRaw, RouteLocationNormalized, NavigationGuardNext } from 'vue-router';

// Definice rout pro aplikaci
const routes: RouteRecordRaw[] = [
  { path: '/', name: 'Home', component: Home },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  {
    path: '/plants',
    name: 'Plants',
    component: Plants,
    beforeEnter: (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
      if (keycloak.authenticated) {
        next();  // Pokud je uživatel přihlášen, umožníme přístup
      } else {
        next('/login');  // Přesměrování na login stránku
      }
    }
  },
  {
    path: '/plants/:id',
    name: 'PlantDetail',
    component: PlantDetail,
    beforeEnter: (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
      if (keycloak.authenticated) {
        next();  // Pokud je uživatel přihlášen, umožníme přístup
      } else {
        next('/login');  // Přesměrování na login stránku
      }
    }
  },
  {
    path: '/tips',
    name: 'Tips',
    component: Tips,
    beforeEnter: (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
      if (keycloak.authenticated) {
        next();  // Pokud je uživatel přihlášen, umožníme přístup
      } else {
        next('/login');  // Přesměrování na login stránku
      }
    }
  },
  {
    path: '/tips/add',
    name: 'AddTip',
    component: AddTip,
    beforeEnter: (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
      if (keycloak.authenticated) {
        next();  // Pokud je uživatel přihlášen, umožníme přístup
      } else {
        next('/login');  // Přesměrování na login stránku
      }
    }
  },
];

// Vytvoření instance routeru s historií
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), // Použití BASE_URL
  routes, // Předání definovaných rout
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
