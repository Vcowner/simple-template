/*
 * @Author: liaokt
 * @Description: 角色相关 API
 * @Date: 2025-12-12
 */
import { ApiResponse, request } from '@/utils/request'
import type { Role } from '@/types/modules/role'
import type {
  RoleListParams,
  RoleListResponse,
  CreateRoleParams,
  UpdateRoleParams
} from '@/types/modules/role'

/**
 * 获取所有角色列表
 */
export const getAllRoles = async (): Promise<Role[]> => {
  const response = await request.get<{ data: Role[] }>('/roles')
  return response.data || []
}

/**
 * 获取角色列表（支持查询参数）
 * @param params 查询参数
 * @returns 角色列表响应数据
 */
export const getRoleList = async (
  params?: RoleListParams
): Promise<ApiResponse<RoleListResponse>> => {
  return await request.get<ApiResponse<RoleListResponse>>('/roles/', { params })
}

/**
 * 创建角色
 */
export const createRole = async (params: CreateRoleParams): Promise<Role> => {
  const response = await request.post<{ data: Role }>('/roles/', params)
  return response.data
}

/**
 * 更新角色
 */
export const updateRole = async (code: string, params: UpdateRoleParams): Promise<Role> => {
  const response = await request.put<{ data: Role }>(`/roles/${code}`, params)
  return response.data
}

/**
 * 删除角色
 */
export const deleteRole = async (code: string): Promise<void> => {
  await request.delete(`/roles/${code}`)
}
