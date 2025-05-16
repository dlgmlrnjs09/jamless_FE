// src/router/index.ts
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import DashboardView from '@/views/DashboardView.vue';
import TouristSpotView from '@/views/TouristSpotView.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Dashboard',
    component: DashboardView
  },
  {
    path: '/spots',
    name: 'TouristSpots',
    component: TouristSpotView
  },
  {
    path: '/spots/:id',
    name: 'SpotDetail',
    component: () => import('@/views/SpotDetailView.vue')
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;