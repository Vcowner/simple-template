/*
 * @Author: liaokt
 * @Description:
 * @Date: 2025-12-01 15:34:35
 * @LastEditors: liaokt
 * @LastEditTime: 2025-12-05 15:35:59
 */
/**
 * 路由相关类型定义（不直接依赖 vue-router 内部类型，避免编译时耦合）
 */

// 扩展路由 meta 类型
export interface ExtendedRouteMeta {
  title?: string
  requiresAuth?: boolean
  roles?: string[]
  menuId?: string // 菜单权限编码（如果设置，会检查是否有该菜单权限）
  icon?: string // 图标名称，对应 @ant-design/icons-vue 中的图标组件名
  hidden?: boolean // 是否在菜单中隐藏
  keepAlive?: boolean
  affix?: boolean
  order?: number // 菜单排序
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
