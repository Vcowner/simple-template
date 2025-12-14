/*
 * @Author: liaokt
 * @Description: 环境变量处理工具函数
 * @Date: 2025-11-27 17:10:30
 * @LastEditors: liaokt
 * @LastEditTime: 2025-12-10 10:09:55
 */
import path from 'path'

/**
 * 可记录类型（键值对对象）
 */
export type Recordable<T = any> = Record<string, T>

/**
 * Vite 环境变量类型定义
 */
export interface ViteEnv {
  VITE_USER_NODE_ENV?: "development" | "production" | "test" | "mock"
  VITE_PORT?: number
  VITE_PROXY?: Array<{
    prefix: string
    target: string
    pathRewrite?: string
  }>
  VITE_OPEN?: boolean
  VITE_REPORT?: boolean | string
  VITE_DROP_CONSOLE?: boolean | string
  VITE_MINIFY?: string
  VITE_API_BASE_URL?: string
  VITE_OPENP_MENU_PERMIT?: boolean | string;
  [key: string]: any
}

/**
 * 判断是否为开发环境
 * @param mode - 环境模式字符串
 * @returns 是否为开发环境
 */
export function isDevFn(mode: string): boolean {
  return mode === 'development'
}

/**
 * 判断是否为生产环境
 * @param mode - 环境模式字符串
 * @returns 是否为生产环境
 */
export function isProdFn(mode: string): boolean {
  return mode === 'production'
}

/**
 * 判断是否为测试环境
 * @param mode - 环境模式字符串
 * @returns 是否为测试环境
 */
export function isTestFn(mode: string): boolean {
  return mode === 'test'
}

/**
 * 判断是否启用打包分析报告
 * @returns 是否启用报告模式
 */
export function isReportMode(): boolean {
  return process.env.VITE_REPORT === 'true'
}

/**
 * 包装环境变量，将字符串类型转换为对应的 JavaScript 类型
 * - 'true'/'false' → boolean
 * - '123' → number (仅针对 VITE_PORT)
 * - JSON 字符串 → 对象 (仅针对 VITE_PROXY)
 * - 其他保持字符串类型
 *
 * @param envConf - 原始环境变量配置对象
 * @returns 处理后的环境变量对象
 *
 * @example
 * ```typescript
 * const env = wrapperEnv({
 *   VITE_PORT: '8080',
 *   VITE_OPEN: 'true',
 *   VITE_PROXY: '[{"prefix":"/api","target":"http://localhost:3000"}]'
 * })
 * // 结果: { VITE_PORT: 8080, VITE_OPEN: true, VITE_PROXY: [...] }
 * ```
 */
export function wrapperEnv(envConf: Recordable<string>): ViteEnv {
  const ret: ViteEnv = {}

  for (const envName of Object.keys(envConf)) {
    let realName: any = envConf[envName]?.replace(/\\n/g, '\n') || ''

    // 布尔值转换
    if (realName === 'true') {
      realName = true
    } else if (realName === 'false') {
      realName = false
    }

    // 端口号转换为数字
    if (envName === 'VITE_PORT' && realName) {
      realName = Number(realName)
    }

    // 代理配置 JSON 字符串解析
    if (envName === 'VITE_PROXY' && typeof realName === 'string' && realName) {
      try {
        realName = JSON.parse(realName)
      } catch (error) {
        // 解析失败时保持原值
        console.warn(`Failed to parse VITE_PROXY: ${error}`)
      }
    }

    ret[envName] = realName
  }

  return ret
}

/**
 * 获取项目根目录路径
 * 可以传入子路径，会自动拼接
 *
 * @param dir - 可选的子路径参数（支持多个）
 * @returns 解析后的绝对路径
 *
 * @example
 * ```typescript
 * getRootPath() // '/Users/xxx/project'
 * getRootPath('src') // '/Users/xxx/project/src'
 * getRootPath('src', 'components') // '/Users/xxx/project/src/components'
 * ```
 */
export function getRootPath(...dir: string[]): string {
  return path.resolve(process.cwd(), ...dir)
}
