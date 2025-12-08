/**
 * 权限相关 API
 */
import { request } from '@/utils/request'
import type { Permission, Role } from '@/config/permissions'

/**
 * 获取用户权限列表
 */
export const getUserPermissions = async (): Promise<string[]> => {
  const response = await request.get<{ data: string[] }>('/user/permissions')
  return response.data || []
}

/**
 * 获取所有权限列表
 */
export const getAllPermissions = async (): Promise<Permission[]> => {
  const response = await request.get<{ data: Permission[] }>('/permissions')
  return response.data || []
}

/**
 * 获取所有角色列表
 */
export const getAllRoles = async (): Promise<Role[]> => {
  const response = await request.get<{ data: Role[] }>('/roles')
  return response.data || []
}
