/*
 * @Author: liaokt
 * @Description:
 * @Date: 2025-12-05 15:22:43
 * @LastEditors: liaokt
 * @LastEditTime: 2025-12-09 09:21:28
 */
/**
 * 系统设置模块权限配置
 */

import type { PermissionNodeConfig } from '../types'

/**
 * 系统设置模块权限
 */
export const settingsPermissions: Record<string, PermissionNodeConfig> = {
  M03: {
    name: '系统设置',
    // 注意：系统设置是父菜单，没有对应的路由页面，所以不设置 routeName
    M0303: {
      name: '权限管理',
      routeName: 'PermissionList',
      A030301: { name: '新增权限' },
      A030302: { name: '编辑权限' },
      A030303: { name: '删除权限' },
      A030304: { name: '查看权限' }
    },
    M0301: {
      name: '角色管理',
      routeName: 'RoleList',
      A030101: { name: '新增角色' },
      A030102: { name: '编辑角色' },
      A030103: { name: '删除角色' },
      A030104: { name: '查看角色' },
      A030105: { name: '分配权限' }
    },
    M0302: {
      name: 'SQL 生成工具',
      routeName: 'SettingsSqlGenerator',
      A030201: { name: '生成 SQL' },
      A030202: { name: '下载 SQL' }
    }
  }
}
