/**
 * 用户相关类型定义
 */

// 用户信息
export interface UserInfo {
  id: number | string
  name: string
  email?: string
  avatar?: string
  phone?: string
  roles?: string[]
  permissions?: string[]
  [key: string]: any
}

// 用户登录参数
export interface LoginParams {
  username: string
  password: string
  captcha?: string
  rememberMe?: boolean
  [key: string]: any
}

// 用户登录响应
export interface LoginResponse {
  token: string
  refreshToken?: string
  userInfo: UserInfo
  permissions?: string[] // 登录时返回的权限列表（可选）
  expiresIn?: number
}

// 用户注册参数
export interface RegisterParams {
  username: string
  password: string
  email?: string
  phone?: string
  [key: string]: any
}
