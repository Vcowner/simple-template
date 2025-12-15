import { DashboardOutlined } from '@ant-design/icons-vue'

/**
 * 总览路由配置
 */
export const overviewRoutes = {
  path: '/overview',
  name: 'Overview',
  component: () => import('../../views/overview/index.vue'),
  meta: {
    title: '总览',
    icon: DashboardOutlined,
    menuId: 'M00', // 关联权限编码 M00
    order: 0
  }
}
