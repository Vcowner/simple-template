/**
 * 认证相关路由配置（登录页等）
 */
export const authRoutes = {
  path: '/login',
  name: 'Login',
  component: () => import('../../views/auth/login-index.vue'),
  meta: {
    title: '登录'
  }
}
