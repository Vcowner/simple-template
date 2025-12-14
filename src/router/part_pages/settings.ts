import { SettingOutlined } from '@ant-design/icons-vue'

/**
 * 系统设置路由配置
 */
export const settingsRoutes = {
  path: '/settings',
  name: 'Settings',
  meta: {
    title: '系统设置',
    icon: SettingOutlined,
    menuId: 'M03', // 关联权限编码 M03
    order: 2
  },
  children: [
    {
      path: '/settings/role',
      name: 'RoleList',
      component: () => import('../../views/settings/role/index.vue'),
      meta: {
        title: '角色管理',
        menuId: 'M0301', // 关联权限编码 M0301（原 M02）
        order: 2
      }
    },
    {
      path: '/settings/sql-generator',
      name: 'SettingsSqlGenerator',
      component: () => import('../../views/settings/sql-generator.vue'),
      meta: {
        title: 'SQL 生成工具',
        menuId: 'M0302', // 关联权限编码 M0302（原 M0303）
        order: 3
      }
    }
  ]
}
