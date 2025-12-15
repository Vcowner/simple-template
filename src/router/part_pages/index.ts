/*
 * @Author: liaokt
 * @Description: 有菜单的路由配置（part_pages）
 * @Date: 2025-12-15 09:09:54
 * @LastEditors: liaokt
 * @LastEditTime: 2025-12-15 09:26:33
 */
import { overviewRoutes } from './overview'
import { userRoutes } from './user'
import { settingsRoutes } from './settings'

/**
 * 有菜单的路由配置（part_pages）
 * 这些路由会显示在侧边栏菜单中
 */
export const partPagesRoutes = [overviewRoutes, userRoutes, settingsRoutes]
