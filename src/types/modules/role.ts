/**
 * 角色相关类型定义
 */

/**
 * 角色信息接口
 */
export interface Role {
  /** 角色编码 */
  code: string
  /** 角色名称 */
  name: string
  /** 角色描述 */
  description?: string
  /** 角色权限编码列表 */
  permissions?: string[]
  /** 是否系统角色（系统角色不可删除） */
  isSystem?: boolean
}

// 角色列表项
export interface RoleListItem extends Role {
  createTime?: string
  updateTime?: string
}

// 角色列表查询参数
export interface RoleListParams {
  page?: number
  page_size?: number
  name?: string
  code?: string
  isSystem?: boolean | string
  [key: string]: any
}

// 角色列表响应
export interface RoleListResponse {
  list: RoleListItem[]
  total: number
}

// 创建角色参数
export interface CreateRoleParams {
  code: string
  name: string
  description?: string
  permissions?: string[]
  isSystem?: boolean
}

// 更新角色参数
export interface UpdateRoleParams {
  name?: string
  description?: string
  permissions?: string[]
  isSystem?: boolean
}
