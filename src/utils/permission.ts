/**
 * 权限相关的工具函数
 */

import { usePermissionStore } from '@/store/modules/permission'
import type { IMenu } from '@/types/modules/user'

/**
 * 递归查找第一个有路由名称的菜单
 * @param menus 菜单列表
 * @returns 第一个有路由名称的菜单名称，如果未找到返回 null
 */
function findFirstRoute(menus: IMenu[]): string | null {
  for (const menu of menus) {
    // 优先查找子菜单
    if (menu.children && menu.children.length > 0) {
      const childRoute = findFirstRoute(menu.children)
      if (childRoute) {
        return childRoute
      }
    }
    // 如果当前菜单有路由名称，返回它
    if (menu.name) {
      return menu.name
    }
  }
  return null
}

/**
 * 跳转到用户有权限的第一个菜单页面
 * @param router 路由实例（需要包含 replace 方法）
 * @param permissionStore 权限 store 实例
 * @returns 是否成功跳转
 */
export async function redirectToFirstAuthorizedMenu(
  router: {
    replace: (to: { name: string } | string) => Promise<any>
  },
  permissionStore: ReturnType<typeof usePermissionStore>
): Promise<boolean> {
  // 确保权限数据已初始化
  if (!permissionStore.loaded) {
    await permissionStore.init()
  }

  // 直接使用 menuList 中的第一个菜单（menuList 已经是根据权限过滤后的）
  const firstMenuRoute = findFirstRoute(permissionStore.menuList)

  // 如果找到有权限的菜单，跳转到该菜单
  if (firstMenuRoute) {
    await router.replace({ name: firstMenuRoute })
    return true
  }

  // 如果没有找到任何有权限的菜单，跳转到 404
  await router.replace({ name: 'not-found' })
  return false
}
