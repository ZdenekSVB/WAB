import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Signup from '../views/Signup.vue';
import Workouts from '../views/Workouts.vue';
import AddWorkout from '../views/AddWorkout.vue'; // Import nové stránky
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
      path: '/workouts',
      component: Workouts,
      meta: { requiresAuth: true },
    },
    {
      path: '/add-workout',
      component: AddWorkout,
      meta: { requiresAuth: true },
    },
  ],
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.user) {
    next('/login'); // Přesměrujte nepřihlášené uživatele na přihlášení
  } else if (!to.meta.requiresAuth && authStore.user) {
    next('/'); // Přesměrujte přihlášené uživatele na domovskou stránku
  } else {
    next();
  }
});

export default router;