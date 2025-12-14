/**
 * 权限配置 - 嵌套结构
 * 使用权限编码作为 key，结构更直观
 *
 * 格式：M01: { M0101: { A010101: { name: '...' } } }
 *
 * 注意：权限和路由的关联通过路由配置中的 meta.menuId（权限编码）建立
 * 权限数据结构中不包含路由信息，保持权限和路由的解耦
 */

import { isValidPermissionCode } from './utils'
import type { PermissionNodeConfig, BuiltPermission } from './types'
import { userPermissions } from './modules/user'
import { rolePermissions } from './modules/role'
import { settingsPermissions } from './modules/settings'

/**
 * 权限配置树
 * 合并所有模块的权限配置
 */
export const PERMISSION_CONFIG: Record<string, PermissionNodeConfig> = {
  ...userPermissions,
  ...rolePermissions,
  ...settingsPermissions
}

/**
 * 构建后的权限列表
 */
let builtPermissions: BuiltPermission[] | null = null
let permissionMap: Map<string, BuiltPermission> | null = null

/**
 * 已知的配置字段（非权限编码的 key）
 */
const CONFIG_FIELDS = new Set(['name'])

/**
 * 判断 key 是否是权限编码
 */
function isPermissionCode(key: string): boolean {
  return isValidPermissionCode(key)
}

/**
 * 构建权限数据
 */
function buildPermissions(): {
  permissions: BuiltPermission[]
  map: Map<string, BuiltPermission>
} {
  if (builtPermissions && permissionMap) {
    return { permissions: builtPermissions, map: permissionMap }
  }

  const permissions: BuiltPermission[] = []
  const map = new Map<string, BuiltPermission>()

  /**
   * 递归构建权限节点
   */
  function buildNode(
    code: string,
    config: PermissionNodeConfig,
    parentCode?: string,
    path: string[] = []
  ): void {
    const currentPath = [...path, config.name]

    // 判断是菜单权限还是操作权限
    const isMenu = code.startsWith('M')
    const type: 'menu' | 'button' = isMenu ? 'menu' : 'button'

    // 构建权限对象
    const permission: BuiltPermission = {
      code,
      name: config.name,
      type,
      parentCode,
      path: currentPath
    }

    permissions.push(permission)
    map.set(code, permission)

    // 处理子节点
    Object.keys(config).forEach(key => {
      // 跳过配置字段
      if (CONFIG_FIELDS.has(key)) {
        return
      }

      // 只处理权限编码格式的 key
      if (!isPermissionCode(key)) {
        if (process.env.NODE_ENV === 'development') {
          console.warn(`[权限配置] 发现无效的权限编码: ${key}，已跳过`)
        }
        return
      }

      const childConfig = config[key]
      if (childConfig && typeof childConfig === 'object' && 'name' in childConfig) {
        // key 就是权限编码
        buildNode(key, childConfig as PermissionNodeConfig, code, currentPath)
      }
    })
  }

  // 遍历根节点
  Object.keys(PERMISSION_CONFIG).forEach(code => {
    if (!isPermissionCode(code)) {
      if (process.env.NODE_ENV === 'development') {
        console.error(`[权限配置] 根节点权限编码无效: ${code}`)
      }
      return
    }
    buildNode(code, PERMISSION_CONFIG[code])
  })

  builtPermissions = permissions
  permissionMap = map

  return { permissions, map }
}

/**
 * 获取构建后的权限列表
 */
export function getBuiltPermissions(): BuiltPermission[] {
  return buildPermissions().permissions
}

/**
 * 根据权限编码获取权限信息
 */
export function getPermissionByCode(code: string): BuiltPermission | undefined {
  return buildPermissions().map.get(code)
}

/**
 * 获取权限树（包含编码）
 */
export function getPermissionTree(): BuiltPermission[] {
  const { permissions } = buildPermissions()
  const tree: BuiltPermission[] = []
  const map = new Map<string, BuiltPermission & { children?: BuiltPermission[] }>()

  // 创建映射
  permissions.forEach(perm => {
    map.set(perm.code, { ...perm, children: [] })
  })

  // 构建树结构
  permissions.forEach(perm => {
    const node = map.get(perm.code)!
    if (perm.parentCode && map.has(perm.parentCode)) {
      const parent = map.get(perm.parentCode)!
      parent.children!.push(node)
    } else {
      tree.push(node)
    }
  })

  return tree
}

// 导出类型和工具函数
export type {
  PermissionNodeConfig,
  BuiltPermission,
  Permission,
  Role,
  PermissionCheckMode
} from './types'
export * from './utils'

// 导出各模块权限配置（方便单独使用）
export { userPermissions } from './modules/user'
export { rolePermissions } from './modules/role'
export { settingsPermissions } from './modules/settings'

// 导出 SQL 生成工具
export {
  generatePermissionSql,
  generateFullSqlScript,
  downloadSqlScript,
  generatePermissionJson
} from './generateSql'
