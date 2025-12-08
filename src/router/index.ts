/*
 * @Author: liaokt
 * @Description:
 * @Date: 2025-11-10 15:26:49
 * @LastEditors: liaokt
 * @LastEditTime: 2025-12-05 17:30:34
 */
import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/store/user'
import { usePermissionStore } from '@/store/permission'
import { redirectToFirstAuthorizedMenu } from '@/utils/permission'
import { ROUTE_NAME } from '@/constants/route'

// 白名单路由：不需要登录即可访问的路由名称
const WHITELIST_ROUTES = [ROUTE_NAME.LOGIN, ROUTE_NAME.NOT_FOUND] as const

const routes = [
  {
    path: '/',
    component: () => import('../layouts/DynamicLayout.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('../views/Home.vue'),
        meta: {
          title: '首页',
          icon: 'HomeOutlined',
          order: 0
        }
      },
      // 用户管理模块
      {
        path: '/user',
        name: 'User',
        meta: {
          title: '用户管理',
          icon: 'AppstoreOutlined',
          menuId: 'M01', // 关联权限编码 M01
          order: 1
        },
        children: [
          {
            path: '/user/list',
            name: 'UserList',
            component: () => import('../views/Home.vue'), // TODO: 替换为实际组件
            meta: {
              title: '用户列表',
              menuId: 'M0101', // 关联权限编码 M0101
              order: 1
            }
          },
          {
            path: '/user/role',
            name: 'UserRole',
            component: () => import('../views/Home.vue'), // TODO: 替换为实际组件
            meta: {
              title: '用户角色',
              menuId: 'M0102', // 关联权限编码 M0102
              order: 2
            }
          }
        ]
      },
      // 角色管理模块
      {
        path: '/role',
        name: 'Role',
        meta: {
          title: '角色管理',
          icon: 'SettingOutlined',
          menuId: 'M02', // 关联权限编码 M02
          order: 2
        },
        children: [
          {
            path: '/role/list',
            name: 'RoleList',
            component: () => import('../views/Home.vue'), // TODO: 替换为实际组件
            meta: {
              title: '角色列表',
              menuId: 'M0201', // 关联权限编码 M0201
              order: 1
            }
          }
        ]
      },
      // 系统设置模块
      {
        path: '/settings',
        name: 'Settings',
        meta: {
          title: '系统设置',
          icon: 'SettingOutlined',
          menuId: 'M03', // 关联权限编码 M03
          order: 3
        },
        children: [
          {
            path: '/settings/basic',
            name: 'SettingsBasic',
            component: () => import('../views/Home.vue'), // TODO: 替换为实际组件
            meta: {
              title: '基础设置',
              menuId: 'M0301', // 关联权限编码 M0301
              order: 1
            }
          },
          {
            path: '/settings/security',
            name: 'SettingsSecurity',
            component: () => import('../views/Home.vue'), // TODO: 替换为实际组件
            meta: {
              title: '安全设置',
              menuId: 'M0302', // 关联权限编码 M0302
              order: 2
            }
          }
        ]
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

const authGuard: Parameters<typeof router.beforeEach>[0] = async (
  to: any,
  _from: any,
  next: any
) => {
  const userStore = useUserStore()
  const permissionStore = usePermissionStore()

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

  // 如果已登录且访问登录页，重定向到第一个有权限的菜单页面
  if (to.name === 'Login' && userStore.isLoggedIn) {
    await redirectToFirstAuthorizedMenu(router, permissionStore)
    return
  }

  // 如果不在白名单且已登录，检查权限
  if (!isWhitelisted && userStore.isLoggedIn) {
    // 确保权限数据已初始化
    if (!permissionStore.loaded) {
      await permissionStore.init(router)
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
