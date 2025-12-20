import { createRouter, createWebHistory } from 'vue-router'
import ProjectLayout from '@/components/layout/ProjectLayout/index.vue'
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
  },
  {
    path: '/project',
    name: 'project',
    component: ProjectLayout,
    children: [
      {
        path: 'dashboard',
        name: 'projectDashboard',
        component: () => import('@/views/project/dashboard/index.vue'),
      },
      {
        path: 'create',
        name: 'projectNoteCreate',
        component: () => import('@/views/project/create/index.vue'),
      },
      {
        path: 'dialog',
        name: 'projectDialog',
        component: () => import('@/views/project/dialog/index.vue'),
      },
    ],
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...defaultRouterList],
})

export default router
