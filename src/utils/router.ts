import { IMenu } from '@/types'

/**
 * 根据权限过滤路由
 * @param routes 路由列表
 * @param permissions 权限编码列表
 * @returns 过滤后的路由列表（新数组，不修改原数组）
 */
export function filterByPermissions(routes: IMenu[], permissions: string[]): IMenu[] {
  // 使用 Set 提高查找性能
  const permissionSet = new Set(permissions)

  return routes
    .filter(route => {
      // 如果没有 meta.menuId，不显示在菜单中（过滤掉）
      const menuId = route.meta?.menuId || route.menuId
      if (!menuId) {
        return false
      }

      // 如果有 menuId，检查用户是否有该权限
      if (!permissionSet.has(menuId)) {
        return false
      }

      return true
    })
    .map(route => {
      // 创建新对象，避免修改原数组
      const newRoute = { ...route }

      // 递归处理子路由
      if (newRoute.children && newRoute.children.length > 0) {
        const filteredChildren = filterByPermissions(newRoute.children, permissions)
        // 如果过滤后还有子路由，保留父级路由；否则如果父级路由本身没有组件，也过滤掉
        if (filteredChildren.length > 0) {
          newRoute.children = filteredChildren
        } else {
          // 如果父级路由没有组件（只是一个容器），且所有子路由都被过滤了，则过滤掉父级路由
          // 但这里我们已经在 filter 中检查了权限，所以如果父级有权限，即使子路由都被过滤，也保留父级
          // 实际上，如果父级路由有组件，应该保留；如果没有组件，可能需要根据业务需求决定
          // 这里先保留父级路由，即使子路由都被过滤了
          newRoute.children = []
        }
      }

      return newRoute
    })
}
