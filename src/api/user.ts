/*
 * @Author: liaokt
 * @Description:
 * @Date: 2025-12-08 10:38:43
 * @LastEditors: liaokt
 * @LastEditTime: 2025-12-08 10:40:12
 */
/**
 * 用户相关 API
 */
import { request } from '@/utils/request'
import type { UserInfo, LoginParams, LoginResponse } from '@/types/user'

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
export const logout = async (): Promise<void> => {
  await request.post('/auth/logout')
}

/**
 * 获取用户信息
 * @param userId 用户 ID（可选）
 * @returns 用户信息
 */
export const getUserInfo = async (userId?: number | string): Promise<UserInfo> => {
  if (userId) {
    const response = await request.get<{ data: UserInfo }>(`/user/${userId}`)
    return response.data
  } else {
    const response = await request.get<{ data: UserInfo }>('/user/info')
    return response.data
  }
}
