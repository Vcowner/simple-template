/*
 * @Author: liaokt
 * @Description:
 * @Date: 2025-11-10 15:26:49
 * @LastEditors: liaokt
 * @LastEditTime: 2025-11-26 09:19:27
 */
/**
 * API 接口示例
 * 根据实际需求修改和扩展
 */
import { request } from '@/utils/request'
import type { Result } from '@/types/api'

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
