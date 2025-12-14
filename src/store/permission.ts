/*
 * @Author: liaokt
 * @Description:
 * @Date: 2025-12-05 14:48:31
 * @LastEditors: liaokt
 * @LastEditTime: 2025-12-09 09:23:25
 */
/**
 * 权限管理 Store
 * 管理用户权限数据，提供权限检查功能
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useUserStore } from './user'
import { useRoleStore } from './role'
import { getUserPermissions, getAllPermissions } from '@/api/permission'
import {
  getBuiltPermissions,
  getPermissionByCode as getConfigPermissionByCode,
  initRouteInfo,
  parsePermissionCode,
  isValidPermissionCode,
  getParentCodes,
  getRootCode,
  isChildOf,
  type Permission,
  type PermissionCheckMode
} from '@/config/permissions'

/**
 * 权限 Store
 */
export const usePermissionStore = defineStore('permission', () => {
  // 当前用户的所有权限编码列表
  const permissions = ref<string[]>([])

  // 所有权限列表（从后端获取的完整权限树）
  const allPermissions = ref<Permission[]>([])

  // 是否已加载权限数据
  const loaded = ref(false)

  /**
   * 设置用户权限
   */
  const setPermissions = (perms: string[]) => {
    permissions.value = perms
  }

  /**
   * 设置所有权限列表
   */
  const setAllPermissions = (perms: Permission[]) => {
    allPermissions.value = perms
  }

  /**
   * 检查是否有权限
   * @param permission 权限编码，可以是字符串或字符串数组
   * @param mode 检查模式：'all' 需要所有权限，'any' 需要任意一个权限
   * @returns 是否有权限
   */
  const hasPermission = (
    permission: string | string[],
    mode: PermissionCheckMode = 'any'
  ): boolean => {
    // 如果没有传入权限，默认返回 true
    if (!permission || (Array.isArray(permission) && permission.length === 0)) {
      return true
    }

    // 如果权限列表为空，返回 false
    if (permissions.value.length === 0) {
      return false
    }

    // 转换为数组
    const permList = Array.isArray(permission) ? permission : [permission]

    if (mode === 'all') {
      // AND 逻辑：需要拥有所有权限
      return permList.every(perm => permissions.value.includes(perm))
    } else {
      // OR 逻辑：拥有任意一个权限即可
      return permList.some(perm => permissions.value.includes(perm))
    }
  }

  /**
   * 检查是否有权限或角色
   * 先检查权限，如果没有权限则检查角色
   * @param permission 权限编码
   * @param role 角色编码（可选）
   * @param mode 检查模式
   * @returns 是否有权限或角色
   */
  const hasPermissionOrRole = (
    permission?: string | string[],
    role?: string | string[],
    mode: PermissionCheckMode = 'any'
  ): boolean => {
    // 如果指定了权限，先检查权限
    if (permission) {
      if (hasPermission(permission, mode)) {
        return true
      }
    }

    // 如果指定了角色，检查角色（使用 role store）
    if (role) {
      const roleStore = useRoleStore()
      return roleStore.hasRole(role, mode)
    }

    // 如果都没有指定，返回 true
    return true
  }

  /**
   * 根据权限编码获取权限信息
   */
  const getPermissionByCode = (code: string): Permission | undefined => {
    // 先从 allPermissions 中查找
    const found = allPermissions.value.find(p => p.code === code)
    if (found) {
      return found
    }
    // 如果找不到，从权限配置中查找
    const configPerm = getConfigPermissionByCode(code)
    if (configPerm) {
      // 转换为 Permission 格式（去掉 path 字段）
      const { path, ...permission } = configPerm
      return permission
    }
    return undefined
  }

  /**
   * 获取权限树（根据 parentCode 构建树结构）
   */
  const getPermissionTree = (): Permission[] => {
    // 确保权限数据已加载
    if (allPermissions.value.length === 0) {
      const builtPermissions = getBuiltPermissions()
      allPermissions.value = builtPermissions.map(({ path, ...perm }) => perm)
    }

    const permissionMap = new Map<string, Permission & { children?: Permission[] }>()
    const rootPermissions: Permission[] = []

    // 先创建所有权限的映射
    allPermissions.value.forEach(perm => {
      permissionMap.set(perm.code, { ...perm, children: [] })
    })

    // 构建树结构
    allPermissions.value.forEach(perm => {
      const permission = permissionMap.get(perm.code)!
      if (perm.parentCode && permissionMap.has(perm.parentCode)) {
        const parent = permissionMap.get(perm.parentCode)!
        if (!parent.children) {
          parent.children = []
        }
        parent.children.push(permission)
      } else {
        rootPermissions.push(permission)
      }
    })

    // 权限树已按配置顺序构建，无需额外排序
    return rootPermissions
  }

  /**
   * 根据路由名称获取菜单权限
   */
  const getMenuPermissionByRoute = (routeName: string): Permission | undefined => {
    return allPermissions.value.find(p => p.type === 'menu' && p.routeName === routeName)
  }

  /**
   * 根据菜单权限编码获取该菜单下的所有操作权限
   * @param menuCode 菜单权限编码
   * @returns 操作权限列表
   */
  const getButtonPermissionsByMenu = (menuCode: string): Permission[] => {
    return allPermissions.value.filter(p => p.type === 'button' && p.parentCode === menuCode)
  }

  /**
   * 根据路由名称获取该路由对应的所有操作权限
   * @param routeName 路由名称
   * @returns 操作权限列表
   */
  const getButtonPermissionsByRoute = (routeName: string): Permission[] => {
    const menuPermission = getMenuPermissionByRoute(routeName)
    if (!menuPermission) {
      return []
    }
    return getButtonPermissionsByMenu(menuPermission.code)
  }

  /**
   * 检查是否有菜单访问权限
   * @param routeName 路由名称或权限编码
   * @returns 是否有权限
   */
  const hasMenuPermission = (routeName: string): boolean => {
    // 先尝试通过路由名称查找菜单权限
    const menuPermission = getMenuPermissionByRoute(routeName)
    if (menuPermission) {
      return hasPermission(menuPermission.code)
    }
    // 如果找不到，尝试直接使用 routeName 作为权限编码检查
    return hasPermission(routeName)
  }

  /**
   * 获取当前用户有权限的菜单权限列表
   */
  const getAuthorizedMenus = (): Permission[] => {
    return allPermissions.value.filter(p => p.type === 'menu' && hasPermission(p.code))
  }

  /**
   * 获取用户有权限的第一个菜单路由
   * 优先返回有子路由的菜单的第一个子路由，如果没有子路由则返回父路由
   * @returns 路由名称，如果没有找到则返回 null
   */
  const getFirstAuthorizedMenuRoute = (): string | null => {
    // 获取所有有权限的菜单
    const authorizedMenus = getAuthorizedMenus()

    if (authorizedMenus.length === 0) {
      return null
    }

    // 按权限编码排序（M01 < M03），这样可以保证顺序
    const sortedMenus = authorizedMenus.sort((a, b) => {
      return a.code.localeCompare(b.code)
    })

    // 遍历排序后的菜单，找到第一个有路由名称的菜单
    for (const menu of sortedMenus) {
      // 如果菜单有子菜单权限，优先返回第一个子菜单的路由
      const childMenus = allPermissions.value.filter(
        p => p.type === 'menu' && p.parentCode === menu.code && hasPermission(p.code)
      )

      if (childMenus.length > 0) {
        // 按权限编码排序子菜单
        const sortedChildMenus = childMenus
          .filter(child => child.routeName)
          .sort((a, b) => a.code.localeCompare(b.code))

        if (sortedChildMenus.length > 0) {
          return sortedChildMenus[0].routeName || null
        }
      }

      // 如果没有子菜单，且当前菜单有路由名称，返回当前菜单的路由
      if (menu.routeName) {
        return menu.routeName
      }
    }

    return null
  }

  /**
   * 获取当前用户有权限的操作权限列表（按菜单分组）
   */
  const getAuthorizedActions = (): Record<string, Permission[]> => {
    const result: Record<string, Permission[]> = {}

    allPermissions.value
      .filter(p => p.type === 'button' && hasPermission(p.code))
      .forEach(perm => {
        const menuCode = perm.parentCode || 'other'
        if (!result[menuCode]) {
          result[menuCode] = []
        }
        result[menuCode].push(perm)
      })

    return result
  }

  /**
   * 从后端获取用户权限
   * 优先从用户信息中获取权限（登录时已获取），如果没有则从后端 API 获取
   */
  const fetchUserPermissions = async (): Promise<void> => {
    try {
      const userStore = useUserStore()

      // 优先使用用户信息中的权限（登录时已获取）
      const userPermissions = (userStore.userInfo?.permissions as string[] | undefined) || []

      if (process.env.NODE_ENV === 'development') {
        console.log('[权限加载] 从用户信息获取权限:', {
          hasPermissions: userPermissions.length > 0,
          permissions: userPermissions
        })
      }

      if (userPermissions.length > 0) {
        setPermissions(userPermissions)
        loaded.value = true
        return
      }

      // 如果用户信息中没有权限，从后端 API 获取
      const permissions = await getUserPermissions()
      if (permissions && Array.isArray(permissions) && permissions.length > 0) {
        setPermissions(permissions)
      } else {
        setPermissions([])
      }

      loaded.value = true
    } catch (error) {
      console.error('获取用户权限失败:', error)
      setPermissions([])
      loaded.value = true
    }
  }

  /**
   * 从后端获取所有权限列表
   * 优先从数据库获取，如果失败则从配置文件中获取
   */
  const fetchAllPermissions = async (): Promise<void> => {
    try {
      // 优先从后端 API 获取权限数据（数据库）
      try {
        const permissions = await getAllPermissions()
        if (permissions && Array.isArray(permissions) && permissions.length > 0) {
          setAllPermissions(permissions)
          return
        }
      } catch (apiError) {
        console.warn('从 API 获取权限列表失败，使用配置文件权限:', apiError)
      }

      // 如果 API 获取失败，从配置文件获取（用于开发环境或初始化）
      const builtPermissions = getBuiltPermissions()
      const permissions: Permission[] = builtPermissions.map(({ path, ...perm }) => perm)
      setAllPermissions(permissions)
    } catch (error) {
      console.error('加载权限列表失败:', error)
      setAllPermissions([])
    }
  }

  /**
   * 初始化权限数据
   * @param router 路由实例（可选，用于初始化路由信息）
   */
  const init = async (router?: { getRoutes: () => any[] } | any[]): Promise<void> => {
    if (!loaded.value) {
      // 初始化路由信息（如果提供了路由实例）
      if (router) {
        initRouteInfo(router)
      }

      // 先加载所有权限配置
      await fetchAllPermissions()

      // 然后加载用户权限
      await fetchUserPermissions()
    }
  }

  /**
   * 重置权限数据（登出时调用）
   */
  const reset = (): void => {
    permissions.value = []
    loaded.value = false
  }

  return {
    // 状态
    permissions,
    allPermissions,
    loaded,
    // 方法
    setPermissions,
    setAllPermissions,
    hasPermission,
    hasPermissionOrRole,
    getPermissionByCode,
    getPermissionTree,
    getMenuPermissionByRoute,
    getButtonPermissionsByMenu,
    getButtonPermissionsByRoute,
    hasMenuPermission,
    getAuthorizedMenus,
    getFirstAuthorizedMenuRoute,
    getAuthorizedActions,
    fetchUserPermissions,
    fetchAllPermissions,
    init,
    reset,
    // 权限编码校验工具方法（直接导出工具函数）
    parseCode: parsePermissionCode,
    validateCode: isValidPermissionCode,
    getCodeParents: getParentCodes,
    getCodeRoot: getRootCode,
    isCodeChildOf: isChildOf
  }
})

// 导出类型
export type { Permission, PermissionCheckMode } from '@/config/permissions'
