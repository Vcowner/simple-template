/**
 * 权限配置 - 嵌套结构
 * 使用权限编码作为 key，结构更直观
 *
 * 格式：M01: { M0101: { A010101: { name: '...' } } }
 *
 * 路由信息会自动从路由配置中获取（通过 routeName 匹配）
 */

import { isValidPermissionCode } from './utils'
import type { PermissionNodeConfig, BuiltPermission, Permission } from './types'
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
 * 路由名称缓存（用于验证路由是否存在）
 */
let routeNameCache: Set<string> | null = null

/**
 * 初始化路由信息缓存
 * 需要在应用初始化后调用，传入路由实例或路由配置
 */
export function initRouteInfo(routerOrRoutes: { getRoutes: () => any[] } | any[]): void {
  if (!routeNameCache) {
    routeNameCache = new Set()
  }

  // 获取路由列表
  const routes = Array.isArray(routerOrRoutes) ? routerOrRoutes : routerOrRoutes.getRoutes()

  // 递归提取路由名称
  const extractRouteNames = (routes: any[]): void => {
    routes.forEach((route: any) => {
      if (route.name) {
        routeNameCache!.add(route.name as string)
      }
      if (route.children && route.children.length > 0) {
        extractRouteNames(route.children)
      }
    })
  }

  extractRouteNames(routes)
}

/**
 * 重置路由信息缓存（用于开发时热更新）
 */
export function resetRouteInfoCache(): void {
  routeNameCache = null
}

/**
 * 构建后的权限列表
 */
let builtPermissions: BuiltPermission[] | null = null
let permissionMap: Map<string, BuiltPermission> | null = null

/**
 * 已知的配置字段（非权限编码的 key）
 */
const CONFIG_FIELDS = new Set(['name', 'routeName'])

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
      routeName: config.routeName,
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
 * 重置权限构建缓存（用于开发时热更新）
 */
export function resetPermissionCache(): void {
  builtPermissions = null
  permissionMap = null
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
 * 根据路径获取权限编码
 * 例如：getPermissionByPath(['用户管理', '用户列表', '新增用户'])
 */
export function getPermissionByPath(path: string[]): BuiltPermission | undefined {
  const { permissions } = buildPermissions()
  return permissions.find(
    p => p.path.length === path.length && p.path.every((name, i) => name === path[i])
  )
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

/**
 * 根据权限编码路径获取权限编码
 * 例如：getPermissionCode('M01', 'M0101', 'A010101') -> 'A010101'
 */
export function getPermissionCode(...codes: string[]): string | undefined {
  if (codes.length === 0) {
    return undefined
  }

  // 如果传入的是权限编码，直接返回最后一个
  const firstCode = codes[0]
  if (isValidPermissionCode(firstCode)) {
    // 验证所有编码都是有效的
    const allValid = codes.every(code => isValidPermissionCode(code))
    if (allValid) {
      return codes[codes.length - 1]
    }
  }

  return undefined
}

/**
 * 验证权限配置
 * 检查配置中的权限编码格式是否正确
 */
export function validatePermissionConfig(): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []
  const codes = new Set<string>()

  const validateNode = (code: string, config: PermissionNodeConfig, parentCode?: string): void => {
    // 验证权限编码格式
    if (!isValidPermissionCode(code)) {
      errors.push(`无效的权限编码: ${code}`)
      return
    }

    // 检查编码是否重复
    if (codes.has(code)) {
      errors.push(`重复的权限编码: ${code}`)
    }
    codes.add(code)

    // 验证操作权限的父级必须是菜单权限
    if (code.startsWith('A') && parentCode && !parentCode.startsWith('M')) {
      errors.push(`操作权限 ${code} 的父级 ${parentCode} 必须是菜单权限`)
    }

    // 验证菜单权限的父级也必须是菜单权限
    if (code.startsWith('M') && parentCode && !parentCode.startsWith('M')) {
      errors.push(`菜单权限 ${code} 的父级 ${parentCode} 必须是菜单权限`)
    }

    // 递归验证子节点
    Object.keys(config).forEach(key => {
      if (CONFIG_FIELDS.has(key)) {
        return
      }

      if (!isPermissionCode(key)) {
        errors.push(`配置中的 key "${key}" 不是有效的权限编码`)
        return
      }

      const childConfig = config[key]
      if (childConfig && typeof childConfig === 'object' && 'name' in childConfig) {
        validateNode(key, childConfig as PermissionNodeConfig, code)
      }
    })
  }

  // 验证所有根节点
  Object.keys(PERMISSION_CONFIG).forEach(code => {
    validateNode(code, PERMISSION_CONFIG[code])
  })

  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * 导出权限配置（用于同步到后端或生成文档）
 */
export function exportPermissionConfig(): Permission[] {
  return getBuiltPermissions().map(({ path, ...perm }) => perm)
}

/**
 * 权限编码常量（通过路径访问）
 * 例如：PERMISSION_CODES.M01.M0101.A010101 -> 'A010101'
 *
 * 注意：这个 Proxy 主要用于开发时的代码提示，实际使用时建议直接使用权限编码字符串
 */
export const PERMISSION_CODES = new Proxy({} as any, {
  get(_target, prop: string) {
    const { map } = buildPermissions()

    // 如果直接是权限编码，返回编码
    if (map.has(prop)) {
      return prop
    }

    // 否则返回代理对象，支持链式访问
    return new Proxy({} as any, {
      get(_target, nextProp: string) {
        // 如果 nextProp 是权限编码，返回它
        if (map.has(nextProp)) {
          return nextProp
        }

        // 否则尝试查找路径匹配的权限
        const { permissions } = buildPermissions()
        const perm = permissions.find(p => {
          // 尝试匹配路径
          const pathStr = p.path.join('.')
          return pathStr === `${prop}.${nextProp}` || pathStr === nextProp
        })

        return perm?.code || nextProp
      }
    })
  }
})

// 开发环境下验证配置
if (process.env.NODE_ENV === 'development') {
  const validation = validatePermissionConfig()
  if (!validation.valid) {
    console.error('[权限配置] 配置验证失败:', validation.errors)
  }
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
