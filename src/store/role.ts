/*
 * @Author: liaokt
 * @Description: 角色管理 Store
 * @Date: 2025-12-08
 */
/**
 * 角色管理 Store
 * 管理角色数据，提供角色检查功能
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useUserStore } from './user'
import { getAllRoles } from '@/api/permission'
import type { Role, PermissionCheckMode } from '@/config/permissions'

/**
 * 角色 Store
 */
export const useRoleStore = defineStore('role', () => {
  // 所有角色列表
  const allRoles = ref<Role[]>([])

  // 是否已加载角色数据
  const loaded = ref(false)

  /**
   * 设置所有角色列表
   */
  const setAllRoles = (roles: Role[]) => {
    allRoles.value = roles
  }

  /**
   * 检查是否有角色
   * @param role 角色编码，可以是字符串或字符串数组
   * @param mode 检查模式：'all' 需要所有角色，'any' 需要任意一个角色
   * @returns 是否有角色
   */
  const hasRole = (role: string | string[], mode: PermissionCheckMode = 'any'): boolean => {
    const userStore = useUserStore()
    const userRoles = userStore.userInfo?.roles || []

    if (!role || (Array.isArray(role) && role.length === 0)) {
      return true
    }

    if (userRoles.length === 0) {
      return false
    }

    const roleList = Array.isArray(role) ? role : [role]

    if (mode === 'all') {
      return roleList.every(r => userRoles.includes(r))
    } else {
      return roleList.some(r => userRoles.includes(r))
    }
  }

  /**
   * 根据角色编码获取角色信息
   */
  const getRoleByCode = (code: string): Role | undefined => {
    return allRoles.value.find(r => r.code === code)
  }

  /**
   * 从后端获取所有角色列表
   */
  const fetchAllRoles = async (): Promise<void> => {
    try {
      const roles = await getAllRoles()
      if (roles && Array.isArray(roles) && roles.length > 0) {
        setAllRoles(roles)
        loaded.value = true
      } else {
        setAllRoles([])
        loaded.value = true
      }
    } catch (error) {
      console.error('获取角色列表失败:', error)
      setAllRoles([])
      loaded.value = true
    }
  }

  /**
   * 初始化角色数据
   */
  const init = async (): Promise<void> => {
    if (!loaded.value) {
      await fetchAllRoles()
    }
  }

  /**
   * 重置角色数据（登出时调用）
   */
  const reset = (): void => {
    allRoles.value = []
    loaded.value = false
  }

  return {
    // 状态
    allRoles,
    loaded,
    // 方法
    setAllRoles,
    hasRole,
    getRoleByCode,
    fetchAllRoles,
    init,
    reset
  }
})

// 导出类型
export type { Role, PermissionCheckMode } from '@/config/permissions'
