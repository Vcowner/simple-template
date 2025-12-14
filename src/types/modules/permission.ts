/**
 * 权限相关类型定义
 *
 * 类型分类：
 * 1. 基础类型 - 业务数据模型，用于业务逻辑处理
 * 2. 配置类型 - 权限配置相关，用于构建权限树
 * 3. API 接口类型 - 用于前后端数据交互（请求参数、响应数据）
 * 4. 工具类型 - 辅助类型，用于类型检查和工具函数
 */

// ==================== 基础类型（业务数据模型） ====================

/**
 * 权限信息接口
 *
 * 这是从后端获取或用于业务逻辑的权限数据结构
 * 路由和权限的关联通过路由配置中的 meta.menuId（权限编码）建立
 *
 * @example
 * ```typescript
 * const permission: Permission = {
 *   code: 'M01',
 *   name: '用户管理',
 *   type: 'menu',
 *   parentCode: undefined,
 *   children: []
 * }
 * ```
 */
export interface Permission {
  /** 权限编码（唯一标识，如 'M01', 'A010101'） */
  code: string
  /** 权限名称（显示名称） */
  name: string
  /** 父权限编码（用于权限树结构，操作权限的父权限通常是菜单权限） */
  parentCode?: string
  /** 权限类型：menu-菜单权限, button-按钮权限 */
  type: 'menu' | 'button'
  /** 子权限列表（构建树结构时使用） */
  children?: Permission[]
}

// ==================== 配置类型（权限配置相关） ====================

/**
 * 权限节点配置（用于构建权限树）
 *
 * 用于定义权限配置的嵌套结构，权限和路由的关联通过路由配置中的 meta.menuId 建立
 * 不需要在权限中存储路由信息，保持权限和路由的解耦
 *
 * @example
 * ```typescript
 * const config: PermissionNodeConfig = {
 *   name: '用户管理',
 *   M0101: {
 *     name: '用户列表',
 *     A010101: { name: '新增用户' }
 *   }
 * }
 * ```
 */
export interface PermissionNodeConfig {
  /** 权限名称 */
  name: string
  /** 子权限配置（使用权限编码作为 key） */
  [key: string]: PermissionNodeConfig | string | undefined
}

/**
 * 构建后的权限信息（包含路径信息）
 *
 * 从 PermissionNodeConfig 构建而来，包含完整的路径信息
 * 注意：路由信息不在权限数据结构中，通过路由配置的 meta.menuId 关联
 *
 * @example
 * ```typescript
 * const built: BuiltPermission = {
 *   code: 'M01',
 *   name: '用户管理',
 *   type: 'menu',
 *   parentCode: undefined,
 *   path: ['M01']
 * }
 * ```
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
  /** 权限路径（用于显示层级关系，如 ['M01', 'M0101']） */
  path: string[]
}

// ==================== API 接口类型（请求参数） ====================

/**
 * 权限列表查询参数
 *
 * 用于查询权限列表的请求参数
 */
export interface PermissionListParams {
  /** 权限名称（模糊查询） */
  name?: string
  /** 权限类型：menu-菜单权限, button-按钮权限 */
  type?: 'menu' | 'button'
  /** 父权限编码（筛选指定父权限下的子权限） */
  parentCode?: string
  /** 其他查询参数 */
  [key: string]: any
}

/**
 * 创建权限参数
 *
 * 用于创建新权限的请求参数
 */
export interface CreatePermissionParams {
  /** 权限编码（必填，唯一标识） */
  code: string
  /** 权限名称（必填） */
  name: string
  /** 权限类型（必填）：menu-菜单权限, button-按钮权限 */
  type: 'menu' | 'button'
  /** 父权限编码（可选，用于建立权限层级关系） */
  parentCode?: string
}

/**
 * 更新权限参数
 *
 * 用于更新权限信息的请求参数（所有字段都是可选的）
 */
export interface UpdatePermissionParams {
  /** 权限名称 */
  name?: string
  /** 权限类型：menu-菜单权限, button-按钮权限 */
  type?: 'menu' | 'button'
  /** 父权限编码 */
  parentCode?: string
}

// ==================== API 接口类型（响应数据） ====================

/**
 * 权限列表项
 *
 * 权限列表中的单个权限项，继承自 Permission，可能包含额外的字段
 */
export interface PermissionListItem extends Permission {
  /** 子权限列表（递归结构） */
  children?: PermissionListItem[]
}

/**
 * 权限列表响应
 *
 * 获取权限列表接口的响应数据结构
 */
export interface PermissionListResponse {
  /** 权限列表 */
  list: PermissionListItem[]
  /** 总数量（用于分页） */
  total: number
}

// ==================== 工具类型 ====================

/**
 * 权限检查模式
 *
 * 用于权限检查函数的模式参数
 * - 'all': 需要所有权限都存在
 * - 'any': 需要任意一个权限存在
 *
 * @example
 * ```typescript
 * // 需要同时拥有 'M01' 和 'M02' 权限
 * hasPermission(['M01', 'M02'], 'all')
 *
 * // 只需要拥有 'M01' 或 'M02' 其中一个权限
 * hasPermission(['M01', 'M02'], 'any')
 * ```
 */
export type PermissionCheckMode = 'all' | 'any'
