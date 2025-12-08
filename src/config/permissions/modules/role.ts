/*
 * @Author: liaokt
 * @Description:
 * @Date: 2025-12-05 15:22:41
 * @LastEditors: liaokt
 * @LastEditTime: 2025-12-05 15:24:26
 */
/**
 * 角色管理模块权限配置
 */

import type { PermissionNodeConfig } from '../types'

/**
 * 角色管理模块权限
 */
export const rolePermissions: Record<string, PermissionNodeConfig> = {
  M02: {
    name: '角色管理',
    routeName: 'Role',
    M0201: {
      name: '角色列表',
      routeName: 'RoleList',
      A020101: { name: '新增角色' },
      A020102: { name: '编辑角色' },
      A020103: { name: '删除角色' },
      A020104: { name: '查看角色' },
      A020105: { name: '分配权限' }
    }
  }
}
