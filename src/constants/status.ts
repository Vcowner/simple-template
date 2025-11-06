/**
 * 状态相关常量
 */

// 通用状态
export const STATUS = {
  ACTIVE: 1,
  INACTIVE: 0,
  DELETED: -1
} as const

// 启用/禁用状态
export const ENABLE_STATUS = {
  ENABLED: 1,
  DISABLED: 0
} as const

// 是/否状态
export const YES_NO = {
  YES: 1,
  NO: 0
} as const
