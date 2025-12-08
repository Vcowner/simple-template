/**
 * 权限相关的 composable
 * 提供权限检查的便捷方法
 */
import { computed } from 'vue'
import { usePermissionStore } from '@/store/permission'
import { useRoleStore } from '@/store/role'
import type { PermissionCheckMode } from '@/config/permissions'

/**
 * 权限检查 composable
 * @returns 权限检查相关的方法和状态
 */
export function usePermission() {
  const permissionStore = usePermissionStore()
  const roleStore = useRoleStore()

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
    return permissionStore.hasPermission(permission, mode)
  }

  /**
   * 检查是否有角色
   * @param role 角色编码，可以是字符串或字符串数组
   * @param mode 检查模式：'all' 需要所有角色，'any' 需要任意一个角色
   * @returns 是否有角色
   */
  const hasRole = (role: string | string[], mode: PermissionCheckMode = 'any'): boolean => {
    return roleStore.hasRole(role, mode)
  }

  /**
   * 检查是否有权限或角色
   * @param permission 权限编码（可选）
   * @param role 角色编码（可选）
   * @param mode 检查模式
   * @returns 是否有权限或角色
   */
  const hasPermissionOrRole = (
    permission?: string | string[],
    role?: string | string[],
    mode: PermissionCheckMode = 'any'
  ): boolean => {
    return permissionStore.hasPermissionOrRole(permission, role, mode)
  }

  /**
   * 当前用户的所有权限编码列表
   */
  const permissions = computed(() => permissionStore.permissions)

  /**
   * 所有权限列表
   */
  const allPermissions = computed(() => permissionStore.allPermissions)

  /**
   * 所有角色列表
   */
  const allRoles = computed(() => roleStore.allRoles)

  /**
   * 权限树
   */
  const permissionTree = computed(() => permissionStore.getPermissionTree())

  /**
   * 是否已加载权限数据
   */
  const loaded = computed(() => permissionStore.loaded)

  /**
   * 检查是否有菜单访问权限
   */
  const hasMenuPermission = (routeName: string): boolean => {
    return permissionStore.hasMenuPermission(routeName)
  }

  /**
   * 根据路由名称获取该路由对应的所有操作权限
   */
  const getButtonPermissionsByRoute = (routeName: string) => {
    return permissionStore.getButtonPermissionsByRoute(routeName)
  }

  /**
   * 获取当前用户有权限的菜单列表
   */
  const authorizedMenus = computed(() => permissionStore.getAuthorizedMenus())

  /**
   * 获取当前用户有权限的操作权限列表（按菜单分组）
   */
  const authorizedActions = computed(() => permissionStore.getAuthorizedActions())

  return {
    hasPermission,
    hasRole,
    hasPermissionOrRole,
    hasMenuPermission,
    getButtonPermissionsByRoute,
    permissions,
    allPermissions,
    allRoles,
    permissionTree,
    authorizedMenus,
    authorizedActions,
    loaded
  }
}
