/**
 * 用户管理模块权限配置
 */

import type { PermissionNodeConfig } from '../types'

/**
 * 用户管理模块权限
 */
export const userPermissions: Record<string, PermissionNodeConfig> = {
  M01: {
    name: '用户管理',
    A010101: { name: '新增用户' },
    A010102: { name: '编辑用户' },
    A010103: { name: '删除用户' },
    A010104: { name: '查看用户' },
    A010105: { name: '导出用户' }
  }
}
