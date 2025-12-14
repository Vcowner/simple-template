import { UserOutlined } from '@ant-design/icons-vue'

/**
 * 用户管理路由配置
 */
export const userRoutes = {
  path: '/user',
  name: 'User',
  component: () => import('../../views/user/index.vue'),
  meta: {
    title: '用户管理',
    icon: UserOutlined,
    menuId: 'M01', // 关联权限编码 M01
    order: 1
  }
}
