/*
 * @Author: liaokt
 * @Description:
 * @Date: 2025-12-15 09:09:54
 * @LastEditors: liaokt
 * @LastEditTime: 2025-12-15 14:26:16
 */
/**
 * 用户管理模块权限配置
 */

import type { PermissionNodeConfig } from '@/types/modules/permission'

/**
 * 用户管理模块权限
 */
export const userPermissions: Record<string, PermissionNodeConfig> = {
  M01: {
    name: '用户管理',
    A0101: { name: '新增用户' },
    A0102: { name: '编辑用户' },
    A0103: { name: '删除用户' },
    A0104: { name: '查看用户' },
    A0105: { name: '导出用户' }
  }
}
