import { createRouter, createWebHistory } from 'vue-router'

const defaultRouterList = [
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/views/dashboard/index.vue'),
  },
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/auth/index.vue'),
  },
  {
    path: '/:w+',
    name: '404',
    component: () => import('@/views/error/404.vue'),
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...defaultRouterList],
})

export default router
