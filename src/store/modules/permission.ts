/**
 * 权限管理 Store
 * 管理用户权限数据，提供权限检查功能
 * 统一管理所有权限相关逻辑，包括菜单过滤
 */
import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { getUserPermissions, getAllPermissions } from '@/api/permission'
import { filterByPermissions } from '@/utils/router'
import { partPagesRoutes } from '@/router/part_pages/index'
import { envInfo } from '@/config'
import { useUserStore } from './user'
import type { IMenu } from '@/types/modules/user'
import type { Permission, PermissionCheckMode } from '@/types/modules/permission'

/**
 * 权限 Store
 */
export const usePermissionStore = defineStore('permission', () => {
  const userStore = useUserStore()

  // 当前用户的所有权限编码列表（从 userInfo 获取）
  const permissions = computed(() => {
    return userStore.userInfo?.permissions || []
  })

  // 所有权限列表（从后端获取的平铺权限列表，通过 parentCode 构建树结构）
  const allPermissions = ref<Permission[]>([])

  // 是否已加载权限数据
  const loaded = ref(false)

  // 过滤后的菜单列表（根据权限过滤）
  const menuList = ref<IMenu[]>([])

  /**
   * 过滤掉没有 menuId 的路由（这些路由不应该显示在菜单中）
   * 直接使用 meta.menuId
   */
  const filterRoutesWithoutMenuId = (routes: any[]): any[] => {
    return routes
      .filter(route => route.meta?.menuId) // 只保留有 meta.menuId 的路由
      .map(route => {
        // 创建新对象，避免修改原数组
        const newRoute = { ...route }
        // 递归处理子路由
        if (newRoute.children && newRoute.children.length > 0) {
          newRoute.children = filterRoutesWithoutMenuId(newRoute.children)
        }
        return newRoute
      })
  }

  /**
   * 更新菜单列表（根据权限过滤）
   */
  const updateMenuList = (perms: string[]): void => {
    // 先过滤掉没有 menuId 的路由（这些路由不应该显示在菜单中）
    const routesWithMenuId = filterRoutesWithoutMenuId([...partPagesRoutes])

    // 判断是否开启菜单权限校验
    // 注意：envInfo.VITE_OPENP_MENU_PERMIT 可能是字符串 'true'/'false'，需要转换
    const isMenuPermitEnabled =
      envInfo.VITE_OPENP_MENU_PERMIT === true || envInfo.VITE_OPENP_MENU_PERMIT === 'true'

    if (isMenuPermitEnabled) {
      // VITE_OPENP_MENU_PERMIT == true：做权限校验，根据权限过滤菜单
      // 即使权限列表为空，也要进行过滤（返回空数组）
      menuList.value = filterByPermissions(routesWithMenuId, perms)
    } else {
      // VITE_OPENP_MENU_PERMIT == false：不做权限校验，显示所有有 menuId 的路由
      // 不管 permission 返回是否为 []，都不做校验
      menuList.value = routesWithMenuId
    }
  }

  /**
   * 设置用户权限（更新到 userInfo 中）
   * 权限从权限接口获取后，通过此方法更新到 userInfo 中
   */
  const setPermissions = (perms: string[]): void => {
    // 更新 userInfo 中的 permissions
    // 由于 permissions 是 computed，从 userInfo.permissions 读取，所以会自动响应
    if (userStore.userInfo) {
      userStore.setUserInfo({
        ...userStore.userInfo,
        permissions: perms
      })
    } else {
      // 如果 userInfo 不存在，先设置一个基本的 userInfo
      // 这种情况不应该发生，但为了安全起见还是处理一下
      console.warn('[权限设置] userInfo 不存在，无法设置权限')
    }
  }

  // 监听 permissions 变化，自动更新菜单列表
  // 当 userInfo.permissions 变化时，permissions computed 会自动更新，触发此 watch
  watch(
    permissions,
    newPerms => {
      updateMenuList(newPerms)
    },
    { immediate: true }
  )

  /**
   * 设置所有权限列表（平铺数组）
   * @param perms 平铺的权限数组，包含 code, name, type, parentCode 等字段
   */
  const setAllPermissions = (perms: Permission[]): void => {
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
    // 如果没有传入权限参数，默认返回 true（表示不需要权限检查）
    if (permission === undefined || permission === null) {
      return true
    }

    // 如果传入空字符串或空数组，返回 false（没有权限）
    if (permission === '' || (Array.isArray(permission) && permission.length === 0)) {
      return false
    }

    // 如果用户没有任何权限，返回 false
    if (permissions.value.length === 0) {
      return false
    }

    // 转换为数组格式
    const permList = Array.isArray(permission) ? permission : [permission]

    // 过滤掉空字符串
    const validPermList = permList.filter(perm => perm && perm.trim() !== '')

    // 如果没有有效的权限编码，返回 false
    if (validPermList.length === 0) {
      return false
    }

    // 使用 Set 提高查找性能（O(1) vs O(n)）
    const permissionSet = new Set(permissions.value)

    // 根据模式检查权限
    if (mode === 'all') {
      // 需要所有权限都存在
      return validPermList.every(perm => permissionSet.has(perm))
    } else {
      // 需要任意一个权限存在
      return validPermList.some(perm => permissionSet.has(perm))
    }
  }

  /**
   * 获取权限树（从平铺的权限列表构建树结构）
   * 后端返回的是平铺的权限数组，需要根据 parentCode 构建树结构
   * @returns 权限树（根节点数组）
   */
  const getPermissionTree = (): Permission[] => {
    // 如果没有权限数据，返回空数组（必须从接口获取，不从配置文件降级）
    if (allPermissions.value.length === 0) {
      return []
    }

    // 构建权限映射表（code -> Permission）
    const permissionMap = new Map<string, Permission & { children?: Permission[] }>()
    const rootPermissions: Permission[] = []

    // 第一步：将所有权限添加到映射表中，初始化 children 数组
    allPermissions.value.forEach(perm => {
      permissionMap.set(perm.code, { ...perm, children: [] })
    })

    // 第二步：根据 parentCode 构建父子关系
    allPermissions.value.forEach(perm => {
      const permission = permissionMap.get(perm.code)!
      if (perm.parentCode && permissionMap.has(perm.parentCode)) {
        // 有父权限，添加到父权限的 children 中
        const parent = permissionMap.get(perm.parentCode)!
        parent.children!.push(permission)
      } else {
        // 没有父权限或父权限不存在，作为根节点
        rootPermissions.push(permission)
      }
    })

    return rootPermissions
  }

  /**
   * 从后端获取用户权限
   * 直接调用接口获取权限
   * 注意：必须从接口获取，不会使用 mock 数据降级
   */
  const fetchUserPermissions = async (): Promise<void> => {
    try {
      // 从后端 API 获取权限
      const permissions = await getUserPermissions()
      if (permissions && Array.isArray(permissions) && permissions.length > 0) {
        setPermissions(permissions)
        loaded.value = true
        if (process.env.NODE_ENV === 'development') {
          console.log('[权限加载] 从 API 获取权限成功:', permissions)
        }
      } else {
        // API 返回空数组或无效数据
        console.warn('[权限加载] API 返回的权限列表为空或无效')
        setPermissions([])
        loaded.value = true
      }
    } catch (error) {
      console.error('[权限加载] 从 API 获取权限失败:', error)
      // 接口失败时设置为空数组，不使用 mock 数据降级
      setPermissions([])
      loaded.value = true
      throw error
    }
  }

  /**
   * 从后端获取所有权限列表（平铺数组）
   * 后端返回的是平铺的权限数组，包含 code, name, type, parentCode 等字段
   * 需要通过 getPermissionTree() 方法构建树结构
   * 注意：必须从接口获取，不会从配置文件降级
   */
  const fetchAllPermissions = async (): Promise<void> => {
    try {
      // 从后端 API 获取平铺的权限列表
      const permissions = await getAllPermissions()
      if (permissions && Array.isArray(permissions) && permissions.length > 0) {
        // 直接存储平铺列表，不构建树结构
        setAllPermissions(permissions)
        if (process.env.NODE_ENV === 'development') {
          console.log(
            '[权限配置] 从 API 获取权限列表成功:',
            permissions.length,
            '个权限（平铺列表）'
          )
        }
      } else {
        // API 返回空数组或无效数据
        console.warn('[权限配置] API 返回的权限列表为空或无效')
        setAllPermissions([])
      }
    } catch (error) {
      console.error('[权限配置] 从 API 获取权限列表失败:', error)
      // 接口失败时设置为空数组，不降级到配置文件
      setAllPermissions([])
      throw error
    }
  }

  /**
   * 初始化权限数据
   * 优先从 userInfo 中获取权限，如果没有则从接口获取
   */
  const init = async (): Promise<void> => {
    // 如果 userInfo 中已有权限数据，先使用它更新菜单
    const userPerms = permissions.value
    if (userPerms.length > 0) {
      updateMenuList(userPerms)
      loaded.value = true
      return // 如果已有权限数据，直接返回
    }

    // 如果权限为空，也要更新菜单列表（根据 VITE_OPENP_MENU_PERMIT 决定是否显示所有菜单）
    // 这样可以确保即使权限为空，菜单也能正确显示
    updateMenuList([])
    loaded.value = true

    // 如果未加载，从接口获取最新数据（异步获取，不阻塞）
    if (!loaded.value) {
      try {
        // 使用 Promise.allSettled 确保即使某个接口失败也能继续
        await Promise.allSettled([fetchAllPermissions(), fetchUserPermissions()])
        // 无论成功或失败，都标记为已加载，避免阻塞页面渲染
        loaded.value = true
      } catch (error) {
        // 即使权限接口失败，也要标记为已加载，避免阻塞页面渲染
        console.error('[权限初始化] 权限初始化失败:', error)
        loaded.value = true
      }
    }
  }

  /**
   * 重置权限数据（登出时调用）
   */
  const reset = (): void => {
    allPermissions.value = []
    menuList.value = []
    loaded.value = false
    // userInfo 中的 permissions 会在 userStore.logout 时清除
  }

  return {
    // 状态
    permissions,
    allPermissions,
    loaded,
    menuList,
    // 方法
    hasPermission,
    getPermissionTree,

    // 初始化相关
    init,
    reset
  }
})

// 导出类型
export type { Permission, PermissionCheckMode } from '@/types/modules/permission'
