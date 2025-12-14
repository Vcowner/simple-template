/**
 * 全局类型定义统一导出
 */
export * from './common'
export * from './router'
// 接口相关类型（从 modules 导出）
export * from './modules/api'
export * from './modules/user'
export * from './modules/role'
export * from './modules/permission'
// 导出基础业务类型（方便使用）
export type { Permission } from './modules/permission'
export type { Role } from './modules/role'
