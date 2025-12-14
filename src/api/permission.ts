/*
 * @Author: liaokt
 * @Description:
 * @Date: 2025-12-08 10:25:20
 * @LastEditors: liaokt
 * @LastEditTime: 2025-12-09 09:20:37
 */
/**
 * 权限相关 API
 */
import { request } from '@/utils/request'
import type { Permission, Role } from '@/config/permissions'
import type {
  PermissionListParams,
  PermissionListResponse,
  CreatePermissionParams,
  UpdatePermissionParams
} from '@/types/permission'

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

/**
 * 获取权限列表（支持查询参数）
 */
export const getPermissionList = async (
  params?: PermissionListParams
): Promise<PermissionListResponse> => {
  const response = await request.get<{ data: PermissionListResponse }>('/permissions/', { params })
  return response.data
}

/**
 * 创建权限
 */
export const createPermission = async (params: CreatePermissionParams): Promise<Permission> => {
  const response = await request.post<{ data: Permission }>('/permissions/', params)
  return response.data
}

/**
 * 更新权限
 */
export const updatePermission = async (
  code: string,
  params: UpdatePermissionParams
): Promise<Permission> => {
  const response = await request.put<{ data: Permission }>(`/permissions/${code}`, params)
  return response.data
}

/**
 * 删除权限
 */
export const deletePermission = async (code: string): Promise<void> => {
  await request.delete(`/permissions/${code}`)
}
