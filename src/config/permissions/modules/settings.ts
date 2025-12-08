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
    routeName: 'Settings',
    M0301: {
      name: '基础设置',
      routeName: 'SettingsBasic',
      A030101: { name: '编辑设置' },
      A030102: { name: '查看设置' }
    },
    M0302: {
      name: '安全设置',
      routeName: 'SettingsSecurity',
      A030201: { name: '修改密码' },
      A030202: { name: '查看日志' }
    }
  }
}
