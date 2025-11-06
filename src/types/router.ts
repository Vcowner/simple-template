/**
 * 路由相关类型定义
 */
import type { RouteMeta, RouteRecordRaw } from 'vue-router'

// 扩展路由 meta 类型
export interface ExtendedRouteMeta extends RouteMeta {
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
export interface ExtendedRouteRecordRaw extends Omit<RouteRecordRaw, 'meta' | 'children'> {
  meta?: ExtendedRouteMeta
  children?: ExtendedRouteRecordRaw[]
}

// 路由配置类型
export interface RouteConfig {
  path: string
  name: string
  component?: any
  meta?: ExtendedRouteMeta
  children?: RouteConfig[]
}

