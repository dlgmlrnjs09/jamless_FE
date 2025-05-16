import {createRouter, createWebHistory, type RouteRecordRaw} from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../components/pages/Dashboard.vue')
  },
  {
    path: '/places',
    name: 'Places',
    component: () => import('../components/pages/PlacesList.vue')
  },
  {
    path: '/live',
    name: 'LiveMonitoring',
    component: () => import('../components/pages/LiveMonitoring.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;