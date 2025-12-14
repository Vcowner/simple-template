import { homeRoutes } from './home'
import { userRoutes } from './user'
import { settingsRoutes } from './settings'

/**
 * 有菜单的路由配置（part_pages）
 * 这些路由会显示在侧边栏菜单中
 */
export const partPagesRoutes = [homeRoutes, userRoutes, settingsRoutes]
