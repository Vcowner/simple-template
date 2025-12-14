/**
 * 权限配置类型定义
 */

/**
 * 权限节点配置（用于构建权限树）
 * 权限和路由的关联通过路由配置中的 meta.menuId 建立，不需要在权限中存储路由信息
 */
export interface PermissionNodeConfig {
  /** 权限名称 */
  name: string
  /** 子权限配置（使用权限编码作为 key） */
  [key: string]: PermissionNodeConfig | string | undefined
}

/**
 * 构建后的权限信息（包含路径信息）
 * 注意：路由信息不在权限数据结构中，通过路由配置的 meta.menuId 关联
 */
export interface BuiltPermission {
  /** 权限编码 */
  code: string
  /** 权限名称 */
  name: string
  /** 父权限编码（用于权限树结构，操作权限的父权限通常是菜单权限） */
  parentCode?: string
  /** 权限类型：menu-菜单权限, button-按钮权限 */
  type: 'menu' | 'button'
  /** 权限路径（用于显示层级关系） */
  path: string[]
}

/**
 * 权限信息接口
 * 这是从后端获取或用于业务逻辑的权限数据结构
 * 路由和权限的关联通过路由配置中的 meta.menuId（权限编码）建立
 */
export interface Permission {
  /** 权限编码 */
  code: string
  /** 权限名称 */
  name: string
  /** 父权限编码（用于权限树结构，操作权限的父权限通常是菜单权限） */
  parentCode?: string
  /** 权限类型：menu-菜单权限, button-按钮权限 */
  type: 'menu' | 'button'
  /** 子权限列表（构建树结构时使用） */
  children?: Permission[]
}

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

/**
 * 权限检查模式
 */
export type PermissionCheckMode = 'all' | 'any'
