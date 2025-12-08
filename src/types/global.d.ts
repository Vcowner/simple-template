/**
 * 全局类型声明
 */

// 扩展 Window 接口
declare global {
  interface Window {
    // 可以在这里添加全局 window 属性
    [key: string]: any
  }
}

// 扩展 Vue Router 的 RouteMeta
declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    requiresAuth?: boolean
    roles?: string[]
    menuId?: string // 菜单权限编码
    icon?: string
    hidden?: boolean
    keepAlive?: boolean
    [key: string]: any
  }
}

export {}
