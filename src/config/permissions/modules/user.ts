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
    routeName: 'User',
    M0101: {
      name: '用户列表',
      routeName: 'UserList',
      A010101: { name: '新增用户' },
      A010102: { name: '编辑用户' },
      A010103: { name: '删除用户' },
      A010104: { name: '查看用户' },
      A010105: { name: '导出用户' }
    },
    M0102: {
      name: '用户角色',
      routeName: 'UserRole',
      A010201: { name: '分配角色' },
      A010202: { name: '查看角色' }
    }
  }
}
