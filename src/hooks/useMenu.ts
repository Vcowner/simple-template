/**
 * 菜单 Hook
 * 将权限过滤后的菜单转换为 Ant Design Vue 的菜单格式
 */

import { computed, h, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { ItemType } from 'ant-design-vue/es/menu'
import type { SubMenuType, MenuItemType } from 'ant-design-vue/es/menu/src/hooks/useItems'
import type { MenuInfo } from 'ant-design-vue/es/menu/src/interface'
import { usePermissionStore } from '@/store/modules/permission'
import type { IMenu } from '@/types/modules/user'

/**
 * 将路由菜单转换为 Ant Design Vue 菜单项格式
 */
function convertMenuToItems(menus: IMenu[]): ItemType[] {
  if (!menus || menus.length === 0) {
    return []
  }

  return menus
    .filter(menu => menu.name) // 只处理有路由名称的菜单
    .map(menu => {
      // 处理图标：如果存在图标组件，使用 h() 函数渲染
      const iconComponent = menu.meta?.icon
      const icon = iconComponent ? () => h(iconComponent) : undefined

      const baseItem = {
        key: menu.name!,
        label: menu.meta?.title || menu.name,
        ...(icon && { icon })
      }

      // 如果有子菜单，返回 SubMenuType
      if (menu.children && menu.children.length > 0) {
        const subMenu: SubMenuType = {
          ...baseItem,
          children: convertMenuToItems(menu.children)
        }
        return subMenu
      }

      // 否则返回 MenuItemType
      return baseItem as MenuItemType
    })
}

/**
 * 查找菜单的父级菜单 key 列表
 * @param menus 菜单列表
 * @param targetName 目标菜单名称
 * @param parents 父级菜单 key 列表（递归参数）
 * @returns 父级菜单 key 列表，如果未找到返回 null
 */
function findParentKeys(
  menus: IMenu[],
  targetName: string,
  parents: string[] = []
): string[] | null {
  for (const menu of menus) {
    if (menu.name === targetName) {
      return parents
    }
    if (menu.children && menu.children.length > 0) {
      const found = findParentKeys(menu.children, targetName, [...parents, menu.name!])
      if (found) {
        return found
      }
    }
  }
  return null
}

/**
 * 菜单 Hook
 * 提供菜单数据、选中状态和展开状态
 */
export function useMenu() {
  const route = useRoute()
  const router = useRouter()
  const permissionStore = usePermissionStore()

  // 菜单项（从权限过滤后的菜单列表转换）
  const menuItems = computed<ItemType[]>(() => {
    return convertMenuToItems(permissionStore.menuList)
  })

  // 选中的菜单项（当前路由）
  const selectedKeys = ref<string[]>([])

  // 展开的菜单项（包含当前路由的父级菜单）
  const openKeys = ref<string[]>([])

  // 更新选中和展开状态
  const updateMenuState = () => {
    const routeName = route.name
    if (routeName) {
      const routeNameStr = String(routeName)
      const newSelectedKeys = [routeNameStr]

      // 只有当选中项变化时才更新（避免不必要的响应式更新）
      if (selectedKeys.value.length !== 1 || selectedKeys.value[0] !== routeNameStr) {
        selectedKeys.value = newSelectedKeys
      }

      // 查找父级菜单并自动展开
      const parentKeys = findParentKeys(permissionStore.menuList, routeNameStr)
      const newOpenKeys = parentKeys || []

      // 只有当展开项变化时才更新（比较数组长度和内容）
      const openKeysChanged =
        openKeys.value.length !== newOpenKeys.length ||
        !newOpenKeys.every((key, index) => openKeys.value[index] === key)

      if (openKeysChanged) {
        openKeys.value = newOpenKeys
      }
    } else {
      // 清空状态
      if (selectedKeys.value.length > 0) {
        selectedKeys.value = []
      }
      if (openKeys.value.length > 0) {
        openKeys.value = []
      }
    }
  }

  // 监听路由变化，自动更新菜单状态
  watch(
    () => route.name,
    () => {
      updateMenuState()
    },
    { immediate: true }
  )

  // 监听菜单列表变化（只监听引用变化，不深度监听）
  // 当菜单列表更新时（如权限变化），重新计算展开状态
  watch(
    () => permissionStore.menuList,
    () => {
      // 只在有路由名称时才更新，避免不必要的计算
      if (route.name) {
        updateMenuState()
      }
    }
  )

  // 处理菜单点击
  const handleMenuClick = (info: MenuInfo) => {
    const key = String(info.key) // 确保 key 是字符串
    router.push({ name: key })
  }

  return {
    menuItems,
    selectedKeys,
    openKeys,
    handleMenuClick
  }
}
