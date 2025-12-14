/*
 * @Author: liaokt
 * @Description:
 * @Date: 2025-12-08 10:38:43
 * @LastEditors: liaokt
 * @LastEditTime: 2025-12-12 16:06:57
 */
/**
 * 用户相关 API
 */
import { ApiResponse, request } from '@/utils/request'
import type {
  IUserInfo,
  LoginParams,
  LoginResponse,
  UserListParams,
  UserListResponse
} from '@/types/modules/user'

/**
 * 用户登录
 * @param params 登录参数
 * @returns 登录响应数据
 */
export const login = async (params: LoginParams): Promise<LoginResponse> => {
  const response = await request.post<{ data: LoginResponse }>('/auth/login', params)
  return response.data
}

/**
 * 用户登出
 */
export const logout = async (): Promise<ApiResponse<void>> => {
  return await request.post<ApiResponse<void>>('/auth/logout')
}

/**
 * 获取用户信息
 * @param userId 用户 ID（可选）
 * @returns 用户信息
 */
export const getUserInfo = async (userId?: number | string): Promise<ApiResponse<IUserInfo>> => {
  return await request.get<ApiResponse<IUserInfo>>(`/user/${userId}`)
}

/**
 * 获取用户列表
 * @param params 查询参数
 * @returns 用户列表响应数据
 */
export const getUserList = async (
  params?: UserListParams
): Promise<ApiResponse<UserListResponse>> => {
  return await request.get<ApiResponse<UserListResponse>>('/user/', { params })
}
