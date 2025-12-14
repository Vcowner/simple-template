/*
 * @Author: liaokt
 * @Description: 用户相关类型定义
 * @Date: 2025-11-06 09:44:04
 * @LastEditors: liaokt
 * @LastEditTime: 2025-12-12 16:03:06
 */

// 用户信息
export interface IUserInfo {
  id: number | string
  name: string
  token: string
  email?: string
  avatar?: string
  mobile?: string
  [key: string]: any
}

// 菜单信息
export interface IMenu {
  path?: string
  name?: string
  icon?: any
  children?: IMenu[]
  menuId?: string
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
  userInfo: IUserInfo
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

// 用户列表项
export interface UserListItem {
  id: string
  username: string
  nickname: string
  email: string
  phone: string
  status: number
  role: string
  createTime: string
}

// 用户列表查询参数
export interface UserListParams {
  page?: number
  page_size?: number
  username?: string
  status?: number | string
  [key: string]: any
}

// 用户列表响应
export interface UserListResponse {
  list: UserListItem[]
  total: number
}
