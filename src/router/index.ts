/*
 * @Author: liaokt
 * @Description: 路由配置
 * @Date: 2025-11-10 15:26:49
 * @LastEditors: liaokt
 * @LastEditTime: 2025-12-19 10:50:30
 */
import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/store/modules/user'
import { usePermissionStore } from '@/store/modules/permission'
import { redirectToFirstAuthorizedMenu } from '@/utils/permission'
import { partPagesRoutes } from './part_pages'
import { fullPagesRoutes } from './full_pages'
import { envInfo } from '@/config'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/auth/login-index.vue'),
    meta: {
      title: '登录'
    }
  },
  {
    path: '/',
    component: () => import('../layouts/DynamicLayout.vue'),
    children: partPagesRoutes
  },
  ...fullPagesRoutes,
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../views/error/not-found.vue'),
    meta: {
      title: '页面不存在'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ left: 0, top: 0 })
})

const authGuard: Parameters<typeof router.beforeEach>[0] = async (
  to: any,
  _from: any,
  next: any
) => {
  const userStore = useUserStore()

  // 登录页特殊处理
  if (to.name === 'login') {
    // 已登录访问登录页，重定向到第一个有权限的菜单
    if (userStore.token) {
      const permissionStore = usePermissionStore()
      // 确保权限已加载
      if (!permissionStore.loaded) {
        try {
          await permissionStore.init()
        } catch (error) {
          console.error('[路由守卫] 权限初始化失败:', error)
        }
      }
      // 跳转到第一个有权限的菜单
      const redirected = await redirectToFirstAuthorizedMenu(router, permissionStore)
      if (!redirected) {
        // 如果没有找到有权限的菜单，使用查询参数中的 redirect 或首页
        const redirect = (to.query?.redirect as string) || '/'
        next(redirect.startsWith('/') ? redirect : { name: redirect })
      }
      return
    }
    // 未登录访问登录页，直接通过
    next()
    return
  }

  // 其他路由：需要登录
  if (!userStore.token) {
    next({ name: 'login', query: { redirect: to.fullPath } })
    return
  }

  // 如果已登录但权限未加载，先初始化权限数据
  const permissionStore = usePermissionStore()
  if (!permissionStore.loaded) {
    try {
      await permissionStore.init()
    } catch (error) {
      console.error('[路由守卫] 权限初始化失败:', error)
      // 权限初始化失败，仍然允许访问（避免阻塞）
    }
  }

  if (to.path === '/') {
    // 如果返回 false，说明跳转到了 not-found，这里不需要再调用 next()
    return
  }

  // 设置页面标题
  if (to.meta?.title) {
    document.title = `${to.meta.title} - ${envInfo.VITE_APP_TITLE}`
  }

  // 已登录用户直接通过
  next()
}

router.beforeEach(authGuard)

export default router
