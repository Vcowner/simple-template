/**
 * 路由相关类型定义（不直接依赖 vue-router 内部类型，避免编译时耦合）
 */

// 扩展路由 meta 类型
export interface ExtendedRouteMeta {
  title?: string
  requiresAuth?: boolean
  roles?: string[]
  permissions?: string[]
  icon?: string
  hidden?: boolean
  keepAlive?: boolean
  affix?: boolean
  [key: string]: any
}

// 扩展路由记录类型
export interface ExtendedRouteRecordRaw {
  path: string
  name?: string | symbol
  component?: any
  redirect?: string
  meta?: ExtendedRouteMeta
  children?: ExtendedRouteRecordRaw[]
  [key: string]: any
}

// 路由配置类型
export interface RouteConfig {
  path: string
  name: string
  component?: any
  meta?: ExtendedRouteMeta
  children?: RouteConfig[]
}
