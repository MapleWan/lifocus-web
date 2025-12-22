import { createRouter, createWebHistory } from 'vue-router'
import ProjectLayout from '@/components/layout/ProjectLayout/index.vue'
import { getToken } from '@/utils/auth';
import NProgress from "nprogress";
import "nprogress/nprogress.css";
NProgress.configure({ showSpinner: false });

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

const whiteList = ["/login", "/register"];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...defaultRouterList],
})

router.beforeEach((to, from, next) => {
  NProgress.start();
  if (whiteList.includes(to.path)) {
    next();
  } else {
    const token = getToken();
    if (token) {
      next();
    } else {
      next("/login");
    }
  }
  NProgress.done();
});

export default router
