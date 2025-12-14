/**
 * 权限相关类型定义
 */
import type { Permission } from '@/config/permissions/types'

// 权限列表项
export interface PermissionListItem extends Permission {
  children?: PermissionListItem[]
}

// 权限列表查询参数
export interface PermissionListParams {
  name?: string
  type?: 'menu' | 'button'
  parentCode?: string
  [key: string]: any
}

// 权限列表响应
export interface PermissionListResponse {
  list: PermissionListItem[]
  total: number
}

// 创建权限参数
export interface CreatePermissionParams {
  code: string
  name: string
  type: 'menu' | 'button'
  parentCode?: string
  routeName?: string
}

// 更新权限参数
export interface UpdatePermissionParams {
  name?: string
  type?: 'menu' | 'button'
  parentCode?: string
  routeName?: string
}
