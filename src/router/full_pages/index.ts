/*
 * @Author: liaokt
 * @Description:
 * @Date: 2025-12-08 17:15:33
 * @LastEditors: liaokt
 * @LastEditTime: 2025-12-08 17:17:18
 */
import { authRoutes } from './auth'
import { errorRoutes } from './error'

/**
 * 无菜单的路由配置（full_pages）
 * 这些路由不会显示在侧边栏菜单中，通常是全屏页面
 */
export const fullPagesRoutes = [authRoutes, ...errorRoutes]
