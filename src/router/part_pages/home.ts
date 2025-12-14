import { HomeOutlined } from '@ant-design/icons-vue'

/**
 * 首页路由配置
 */
export const homeRoutes = {
  path: '',
  name: 'Home',
  component: () => import('../../views/Home.vue'),
  meta: {
    title: '首页',
    icon: HomeOutlined,
    order: 0
  }
}
