/**
 * 权限编码校验工具
 * 提供权限编码的解析和验证功能
 *
 * 编码规则：
 * - M 开头 = 菜单权限（Menu）
 * - A 开头 = 操作权限（Action）
 * - 数字部分表示层级关系，每2位数字代表一级
 *
 * 示例：
 * - M01 = 一级菜单（用户管理）
 * - M0101 = M01下的子菜单（用户列表）
 * - M0102 = M01下的另一个子菜单（用户角色）
 * - A010101 = M0101下的操作权限（新增用户）
 * - A010102 = M0101下的操作权限（编辑用户）
 * - A010103 = M0101下的操作权限（删除用户）
 */

/**
 * 权限编码类型
 */
export type PermissionCodeType = 'menu' | 'action'

/**
 * 权限编码前缀
 */
export const PERMISSION_PREFIX = {
  MENU: 'M',
  ACTION: 'A'
} as const

/**
 * 权限编码信息
 */
export interface PermissionCodeInfo {
  /** 完整编码 */
  code: string
  /** 类型 */
  type: PermissionCodeType
  /** 层级数组（如 M0101 -> ['01', '01']） */
  levels: string[]
  /** 层级深度（从1开始） */
  depth: number
  /** 父级编码 */
  parentCode?: string
}

/**
 * 解析权限编码
 * @param code 权限编码
 * @returns 权限编码信息
 *
 * @example
 * parsePermissionCode('M01') // { code: 'M01', type: 'menu', levels: ['01'], depth: 1 }
 * parsePermissionCode('M0101') // { code: 'M0101', type: 'menu', levels: ['01', '01'], depth: 2, parentCode: 'M01' }
 * parsePermissionCode('A010101') // { code: 'A010101', type: 'action', levels: ['01', '01', '01'], depth: 3, parentCode: 'A0101' }
 */
export function parsePermissionCode(code: string): PermissionCodeInfo {
  if (!isValidPermissionCode(code)) {
    throw new Error(`无效的权限编码: ${code}`)
  }

  const prefix = code[0]
  const type: PermissionCodeType = prefix === PERMISSION_PREFIX.MENU ? 'menu' : 'action'
  const numberPart = code.slice(1)

  // 每2位数字代表一级
  const levels: string[] = []
  for (let i = 0; i < numberPart.length; i += 2) {
    levels.push(numberPart.slice(i, i + 2))
  }

  const depth = levels.length
  const parentCode = depth > 1 ? `${prefix}${numberPart.slice(0, -2)}` : undefined

  return {
    code,
    type,
    levels,
    depth,
    parentCode
  }
}

/**
 * 验证权限编码格式
 * @param code 权限编码
 * @returns 是否有效
 */
export function isValidPermissionCode(code: string): boolean {
  if (!code || code.length < 3) {
    return false
  }

  const prefix = code[0]
  if (prefix !== PERMISSION_PREFIX.MENU && prefix !== PERMISSION_PREFIX.ACTION) {
    return false
  }

  const numberPart = code.slice(1)
  // 必须是数字，且长度为偶数（每2位一级）
  if (!/^\d+$/.test(numberPart) || numberPart.length % 2 !== 0) {
    return false
  }

  // 每2位数字必须在 01-99 之间
  for (let i = 0; i < numberPart.length; i += 2) {
    const level = numberPart.slice(i, i + 2)
    const num = parseInt(level, 10)
    if (num < 1 || num > 99) {
      return false
    }
  }

  return true
}

/**
 * 获取权限编码的所有父级编码（从根到直接父级）
 * @param code 权限编码
 * @returns 父级编码数组（从根到直接父级）
 *
 * @example
 * getParentCodes('M0101') // ['M01']
 * getParentCodes('M010101') // ['M01', 'M0101']
 * getParentCodes('A010101') // ['M01', 'M0101'] (操作权限的父级是菜单权限)
 */
export function getParentCodes(code: string): string[] {
  const info = parsePermissionCode(code)
  const parents: string[] = []

  if (!info.parentCode) {
    return parents
  }

  // 如果是操作权限，需要找到对应的菜单权限
  if (info.type === 'action') {
    // 操作权限的父级应该是菜单权限
    // A010101 的父级菜单应该是 M0101
    const menuCode = PERMISSION_PREFIX.MENU + code.slice(1)

    // 递归获取菜单权限的所有父级
    const menuParents = getParentCodes(menuCode)
    parents.push(...menuParents, menuCode)
  } else {
    // 菜单权限，递归获取父级
    const parentParents = getParentCodes(info.parentCode)
    parents.push(...parentParents, info.parentCode)
  }

  return parents
}

/**
 * 获取权限编码的根级编码（一级菜单）
 * @param code 权限编码
 * @returns 根级编码
 *
 * @example
 * getRootCode('M0101') // 'M01'
 * getRootCode('A010101') // 'M01'
 */
export function getRootCode(code: string): string {
  const info = parsePermissionCode(code)

  if (info.depth === 1) {
    return code
  }

  // 如果是操作权限，转换为对应的菜单权限
  if (info.type === 'action') {
    const menuCode = PERMISSION_PREFIX.MENU + code.slice(1)
    return getRootCode(menuCode)
  }

  // 取前2位数字（一级菜单）
  const rootNumber = info.levels[0]
  return `${PERMISSION_PREFIX.MENU}${rootNumber}`
}

/**
 * 检查权限编码是否是另一个编码的子级
 * @param childCode 子级编码
 * @param parentCode 父级编码
 * @returns 是否是子级
 *
 * @example
 * isChildOf('M0101', 'M01') // true
 * isChildOf('A010101', 'M01') // true (操作权限的父级菜单)
 * isChildOf('M02', 'M01') // false
 */
export function isChildOf(childCode: string, parentCode: string): boolean {
  if (!isValidPermissionCode(childCode) || !isValidPermissionCode(parentCode)) {
    return false
  }

  const childInfo = parsePermissionCode(childCode)
  const parentInfo = parsePermissionCode(parentCode)

  // 操作权限的父级必须是菜单权限
  if (childInfo.type === 'action' && parentInfo.type !== 'menu') {
    return false
  }

  // 如果子级是操作权限，转换为对应的菜单权限进行比较
  let compareCode = childCode
  if (childInfo.type === 'action') {
    compareCode = PERMISSION_PREFIX.MENU + childCode.slice(1)
  }

  // 检查是否是父级的子级
  return compareCode.startsWith(parentCode) && compareCode.length > parentCode.length
}
