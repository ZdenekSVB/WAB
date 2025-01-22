import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Signup from '../views/Signup.vue';
import Plants from '../views/Plants.vue';
import AddPlant from '../views/AddPlant.vue';
import EditPlant from '../views/EditPlant.vue';
import Settings from '../views/Settings.vue';
import { useAuthStore } from '../stores/authStore';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: Home,
      meta: { requiresAuth: true },
    },
    {
      path: '/login',
      component: Login,
      meta: { requiresAuth: false },
    },
    {
      path: '/signup',
      component: Signup,
      meta: { requiresAuth: false },
    },
    {
      path: '/plants',
      component: Plants,
      meta: { requiresAuth: true },
    },
    {
      path: '/add-plant',
      component: AddPlant,
      meta: { requiresAuth: true },
    },
    {
      path: '/edit-plant/:id',
      component: EditPlant,
      meta: { requiresAuth: true },
    },
    {
      path: '/settings',
      component: Settings,
      meta: { requiresAuth: true },
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // Inicializace uživatele z localStorage
  if (!authStore.user) {
    authStore.initialize();
  }

  // Kontrola, zda je uživatel přihlášen
  if (to.meta.requiresAuth && !authStore.user) {
    next('/login');
  } else if (!to.meta.requiresAuth && authStore.user) {
    next('/');
  } else {
    next();
  }
});

export default router;