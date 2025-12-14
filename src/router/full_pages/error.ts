/**
 * 错误页面路由配置（404等）
 */
export const errorRoutes = [
  {
    path: '/404',
    name: 'NotFound',
    component: () => import('../../views/error/not-found.vue'),
    meta: {
      title: '页面不存在'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404'
  }
]
