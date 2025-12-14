/*
 * @Author: liaokt
 * @Description:
 * @Date: 2025-11-10 15:26:49
 * @LastEditors: liaokt
 * @LastEditTime: 2025-12-12 16:54:14
 */
import { createRouter, createWebHistory } from 'vue-router'
import { usePermissionStore } from '@/store/permission'
import { redirectToFirstAuthorizedMenu } from '@/utils/permission'
import { ROUTE_NAME } from '@/constants/route'
import { partPagesRoutes } from './part_pages'
import { fullPagesRoutes } from './full_pages'

// 白名单路由：不需要登录即可访问的路由名称
const WHITELIST_ROUTES = [ROUTE_NAME.LOGIN, ROUTE_NAME.NOT_FOUND] as const

const routes = [
  {
    path: '/',
    component: () => import('../layouts/DynamicLayout.vue'),
    children: partPagesRoutes
  },
  ...fullPagesRoutes
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const authGuard: Parameters<typeof router.beforeEach>[0] = async (
  to: any,
  _from: any,
  next: any
) => {
  const permissionStore = usePermissionStore()

  // 设置页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - ${import.meta.env.VITE_APP_TITLE}`
  }

  // 检查路由是否在白名单中
  const isWhitelisted = WHITELIST_ROUTES.includes(to.name as any)

  // 如果不在白名单且未登录，重定向到登录页
  if (!isWhitelisted) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
    return
  }

  // 如果已登录且访问登录页，重定向到第一个有权限的菜单页面
  if (to.name === 'Login') {
    await redirectToFirstAuthorizedMenu(router, permissionStore)
    return
  }

  // 如果不在白名单且已登录，检查权限
  if (!isWhitelisted) {
    // 确保权限数据已初始化
    if (!permissionStore.loaded) {
      await permissionStore.init(router)
    }

    // 如果访问首页，跳转到第一个有权限的菜单或子菜单
    if (to.name === 'Home') {
      await redirectToFirstAuthorizedMenu(router, permissionStore)
      return
    }

    const meta = to.meta || {}
    const menuId = meta.menuId

    // 如果没有 menuId，不允许访问（重定向到 404）
    if (!menuId) {
      console.warn(`[路由守卫] 路由 ${to.name || to.path} 没有设置 menuId，已阻止访问`)
      next({ name: 'NotFound' })
      return
    }

    // 检查用户是否有该 menuId 对应的权限
    if (!permissionStore.hasMenuPermission(menuId)) {
      console.warn(
        `[路由守卫] 用户没有路由 ${to.name || to.path} (menuId: ${menuId}) 的访问权限，已阻止访问`
      )
      next({ name: 'NotFound' })
      return
    }
  }

  next()
}

router.beforeEach(authGuard)

export default router
