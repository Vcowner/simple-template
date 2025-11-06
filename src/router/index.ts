import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/store/user'
import Home from '../views/Home.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: '首页',
      requiresAuth: false
    }
  },
  {
    path: '/404',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue'),
    meta: {
      title: '页面不存在'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, _from, next) => {
  const userStore = useUserStore()

  // 设置页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - ${import.meta.env.VITE_APP_TITLE}`
  }

  // 检查是否需要登录
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    // 可以跳转到登录页
    // next({ name: 'Login', query: { redirect: to.fullPath } })
    next()
  } else {
    next()
  }
})

router.afterEach(() => {
  // 可以在这里添加页面访问统计等
})

export default router
