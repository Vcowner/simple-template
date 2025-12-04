/*
 * @Author: liaokt
 * @Description:
 * @Date: 2025-11-10 15:26:49
 * @LastEditors: liaokt
 * @LastEditTime: 2025-12-04 09:39:35
 */
import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/store/user'
import { ROUTE_NAME } from '@/constants/route'

// 白名单路由：不需要登录即可访问的路由名称
const WHITELIST_ROUTES = [ROUTE_NAME.LOGIN, ROUTE_NAME.NOT_FOUND] as const

const routes = [
  {
    path: '/',
    component: () => import('../layouts/top-side/TopSideLayout.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('../views/Home.vue'),
        meta: {
          title: '首页'
        }
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/auth/login-index.vue'),
    meta: {
      title: '登录'
    }
  },
  {
    path: '/404',
    name: 'NotFound',
    component: () => import('../views/error/not-found.vue'),
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

const authGuard: Parameters<typeof router.beforeEach>[0] = (to: any, _from: any, next: any) => {
  const userStore = useUserStore()

  // 设置页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - ${import.meta.env.VITE_APP_TITLE}`
  }

  // 检查路由是否在白名单中
  const isWhitelisted = WHITELIST_ROUTES.includes(to.name as any)

  // 如果不在白名单且未登录，重定向到登录页
  if (!isWhitelisted && !userStore.isLoggedIn) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
    return
  }

  // 如果已登录且访问登录页，重定向到首页
  if (to.name === 'Login' && userStore.isLoggedIn) {
    const redirect = (to.query.redirect as string) || '/'
    next(redirect)
    return
  }

  next()
}

router.beforeEach(authGuard)

export default router
