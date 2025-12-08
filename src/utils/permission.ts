/**
 * 权限相关的工具函数
 */

import { usePermissionStore } from '@/store/permission'

/**
 * 跳转到用户有权限的第一个菜单页面
 * @param router 路由实例（需要包含 replace 和 getRoutes 方法）
 * @param permissionStore 权限 store 实例
 * @returns 是否成功跳转
 */
export async function redirectToFirstAuthorizedMenu(
  router: {
    replace: (to: { name: string } | string) => Promise<any>
    getRoutes: () => any[]
  },
  permissionStore: ReturnType<typeof usePermissionStore>
): Promise<boolean> {
  // 确保权限数据已初始化
  if (!permissionStore.loaded) {
    await permissionStore.init(router)
  }

  // 获取第一个有权限的菜单路由
  const firstMenuRoute = permissionStore.getFirstAuthorizedMenuRoute()
  if (firstMenuRoute) {
    await router.replace({ name: firstMenuRoute })
    return true
  }

  // 如果没有权限，跳转到404
  await router.replace({ name: 'NotFound' })
  return false
}
