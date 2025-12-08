/**
 * 权限配置类型定义
 */

/**
 * 权限信息接口
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
  /** 关联的路由名称（菜单权限使用） */
  routeName?: string
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
 * - 'all': 需要拥有所有权限（AND 逻辑）
 * - 'any': 拥有任意一个权限即可（OR 逻辑）
 */
export type PermissionCheckMode = 'all' | 'any'

/**
 * 权限节点配置
 */
export interface PermissionNodeConfig {
  /** 权限名称 */
  name: string
  /** 路由名称（用于自动获取路由信息） */
  routeName?: string
  /** 子权限配置（key 为权限编码） */
  [key: string]: PermissionNodeConfig | string | undefined
}

/**
 * 构建后的权限数据
 */
export interface BuiltPermission extends Permission {
  /** 权限路径（用于快速查找） */
  path: string[]
}
