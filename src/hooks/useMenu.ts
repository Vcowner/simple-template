/**
 * 菜单相关的 composable
 * 从路由配置中获取菜单项，支持侧边栏和顶部菜单
 * 支持根据权限过滤菜单
 */
import { computed, h, nextTick, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { ItemType } from 'ant-design-vue'
import type { Component } from 'vue'
import { usePermissionStore } from '@/store/permission'

/**
 * 从路由配置中获取菜单项
 * @returns 菜单项数组和当前选中的菜单项 key
 */
export function useMenu() {
  const route = useRoute()
  const router = useRouter()
  const permissionStore = usePermissionStore()

  /**
   * 检查路由是否有权限访问
   */
  const checkRoutePermission = (routeItem: any): boolean => {
    const meta = routeItem.meta || {}

    // 如果没有设置 menuId，不显示（除了白名单路由）
    if (!meta.menuId) {
      return false
    }

    // 如果设置了 menuId，检查菜单权限
    return permissionStore.hasMenuPermission(meta.menuId)
  }

  // 获取菜单路由
  const getMenuRoutes = () => {
    // 获取当前路由的父路由（通常是 DynamicLayout）
    const currentRoute = router.currentRoute.value
    const matched = currentRoute.matched

    // 查找包含子路由的父路由
    let parentRoute = matched.find((r: any) => r.children && r.children.length > 0)

    if (!parentRoute) {
      // 如果没有找到，尝试从路由表中查找
      const routeRecord = router.getRoutes().find((r: any) => r.path === '/' && r.children)
      parentRoute = routeRecord || null
    }

    if (!parentRoute || !parentRoute.children) {
      return []
    }

    // 过滤出需要在菜单中显示的路由，并按 order 排序
    return parentRoute.children
      .filter((child: any) => {
        const meta = child.meta || {}
        // 检查是否隐藏
        if (meta.hidden) {
          return false
        }
        // 检查是否有标题（菜单项需要标题）
        if (!meta.title) {
          return false
        }
        // 检查权限
        return checkRoutePermission(child)
      })
      .sort((a: any, b: any) => {
        const orderA = (a.meta?.order as number) || 999
        const orderB = (b.meta?.order as number) || 999
        return orderA - orderB
      })
  }

  // 将路由转换为菜单项（支持递归处理子菜单）
  const routeToMenuItem = (routeItem: any): ItemType | null => {
    const meta = routeItem.meta || {}

    // 检查权限
    if (!checkRoutePermission(routeItem)) {
      return null
    }

    // 支持两种方式：直接传入组件，或传入字符串名称
    const icon = meta.icon
    const IconComponent = typeof icon === 'string' ? null : (icon as Component | undefined)

    const menuItem: any = {
      key: (routeItem.name as string) || routeItem.path,
      icon: IconComponent ? () => h(IconComponent) : undefined,
      label: (meta.title as string) || (routeItem.name as string)
    }

    // 如果有子路由，递归处理子菜单
    if (routeItem.children && routeItem.children.length > 0) {
      const childMenuItems = routeItem.children
        .filter((child: any) => {
          const childMeta = child.meta || {}
          return !childMeta.hidden && childMeta.title
        })
        .sort((a: any, b: any) => {
          const orderA = (a.meta?.order as number) || 999
          const orderB = (b.meta?.order as number) || 999
          return orderA - orderB
        })
        .map((child: any) => routeToMenuItem(child))
        .filter((item: any) => item !== null) // 过滤掉没有权限的子菜单

      if (childMenuItems.length > 0) {
        menuItem.children = childMenuItems
      } else {
        // 如果所有子菜单都没有权限，且当前菜单没有 component，则不显示
        if (!routeItem.component) {
          return null
        }
      }
    } else {
      // 没有子菜单时，添加点击事件
      menuItem.onClick = () => {
        if (routeItem.name) {
          router.push({ name: routeItem.name as string })
        } else {
          router.push(routeItem.path)
        }
      }
    }

    return menuItem as ItemType
  }

  // 菜单项列表
  const menuItems = computed<ItemType[]>(() => {
    const menuRoutes = getMenuRoutes()
    return menuRoutes
      .map(routeToMenuItem)
      .filter((item: ItemType | null): item is ItemType => item !== null) // 过滤掉没有权限的菜单项
  })

  // 当前选中的菜单项 key（支持子菜单）
  const selectedKeys = computed(() => {
    const currentName = route.name as string
    return currentName ? [currentName] : []
  })

  // 递归查找所有父级路由（支持多级菜单）
  const findParentRoutes = (
    targetName: string,
    routes: any[],
    currentPath: string[] = []
  ): string[] => {
    for (const routeItem of routes) {
      const newPath = [...currentPath, routeItem.name as string].filter(Boolean)

      // 如果找到目标路由，返回当前路径（排除目标路由本身）
      if (routeItem.name === targetName) {
        return currentPath
      }

      // 如果有子路由，递归查找
      if (routeItem.children && routeItem.children.length > 0) {
        const result = findParentRoutes(targetName, routeItem.children, newPath)
        if (
          result.length > 0 ||
          routeItem.children.some((child: any) => child.name === targetName)
        ) {
          // 如果找到了目标路由或其子路由，添加当前路由到结果中
          if (!result.includes(routeItem.name as string) && routeItem.name) {
            return [routeItem.name as string, ...result]
          }
          return result
        }
      }
    }
    return []
  }

  // 当前展开的菜单项 key（用于子菜单，支持多级菜单）
  // 使用 ref 而不是 computed，因为 v-model:open-keys 需要可写的值
  const openKeys = ref<string[]>([])

  // 计算应该展开的菜单项 key
  const computeOpenKeys = (): string[] => {
    const currentName = route.name as string
    if (!currentName) return []

    // 获取所有路由
    const allRoutes = router.getRoutes()
    const mainRoute = allRoutes.find((r: any) => r.path === '/' && r.children)

    if (!mainRoute || !mainRoute.children) {
      return []
    }

    // 递归查找所有父级路由
    const parentKeys = findParentRoutes(currentName, mainRoute.children)

    // 如果找到了父级路由，返回它们
    if (parentKeys.length > 0) {
      return parentKeys
    }

    // 如果没找到，尝试从路由匹配信息中获取父路由
    // 检查当前路由的 matched 数组，找到有子路由的父路由
    const matched = route.matched
    const parentRouteNames: string[] = []

    for (let i = matched.length - 1; i >= 0; i--) {
      const matchedRoute = matched[i]
      // 如果这个路由有子路由，且子路由中包含当前路由，则它是父路由
      if (matchedRoute.children && matchedRoute.children.length > 0) {
        const hasCurrentRoute = matchedRoute.children.some(
          (child: any) => child.name === currentName
        )
        if (hasCurrentRoute && matchedRoute.name) {
          parentRouteNames.unshift(matchedRoute.name as string)
        }
      }
    }

    return parentRouteNames
  }

  // 更新 openKeys 的函数
  const updateOpenKeys = () => {
    const computedKeys = computeOpenKeys()
    // 直接设置为计算出的父级菜单，确保所有需要的父级菜单都展开
    if (computedKeys.length > 0) {
      openKeys.value = computedKeys
    }
  }

  // 初始化 openKeys（使用 nextTick 确保路由已完全加载）
  nextTick(() => {
    updateOpenKeys()
  })

  // 监听路由变化，自动更新展开的菜单
  watch(
    () => route.name,
    () => {
      // 使用 nextTick 确保路由匹配完成后再计算
      nextTick(() => {
        updateOpenKeys()
      })
    },
    { immediate: true }
  )

  return {
    menuItems,
    selectedKeys,
    openKeys,
    getMenuRoutes,
    routeToMenuItem
  }
}
