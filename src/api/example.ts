/**
 * API 接口示例
 * 根据实际需求修改和扩展
 */
import { request } from '@/utils/request'
import type { Result, PaginationData, PaginationParams } from '@/types/api'

/**
 * 示例：用户信息类型
 */
export interface UserInfo {
  id: number
  name: string
  email: string
  avatar?: string
}

/**
 * 示例：获取用户信息
 */
export const getUserInfo = (id: number): Promise<Result<UserInfo>> => {
  return request.get<Result<UserInfo>>(`/user/${id}`)
}

/**
 * 示例：获取用户列表（带分页）
 */
export const getUserList = (
  params: PaginationParams
): Promise<Result<PaginationData<UserInfo>>> => {
  return request.get<Result<PaginationData<UserInfo>>>('/user/list', { params })
}

/**
 * 示例：创建用户
 */
export const createUser = (data: Omit<UserInfo, 'id'>): Promise<Result<UserInfo>> => {
  return request.post<Result<UserInfo>>('/user', data)
}

/**
 * 示例：更新用户
 */
export const updateUser = (id: number, data: Partial<UserInfo>): Promise<Result<UserInfo>> => {
  return request.put<Result<UserInfo>>(`/user/${id}`, data)
}

/**
 * 示例：删除用户
 */
export const deleteUser = (id: number): Promise<Result<void>> => {
  return request.delete<Result<void>>(`/user/${id}`)
}
