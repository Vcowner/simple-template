import type { ProxyOptions } from 'vite'

type ProxyItem = {
  prefix: string
  target: string
  pathRewrite?: string
}

type ProxyList = ProxyItem[]

export type ProxyTargetList = Record<string, ProxyOptions>

/**
 * 创建代理配置，用于解析 .env.development 代理配置
 *
 * @param list - 代理列表配置（从环境变量 VITE_PROXY 解析）
 * @returns 代理配置对象
 *
 * @example
 * ```typescript
 * // 从环境变量读取
 * createProxy(viteEnv.VITE_PROXY)
 *
 * // 或者传入完整配置
 * createProxy([
 *   { prefix: '/api', target: 'http://localhost:3000' }
 * ])
 * ```
 */
export function createProxy(list: ProxyList = []): ProxyTargetList {
  const ret: ProxyTargetList = {}

  // 如果环境变量中配置了代理列表，使用配置的代理
  if (Array.isArray(list) && list.length > 0) {
    list.forEach(item => {
      const httpsRE = /^https:\/\//
      const isHttps = httpsRE.test(item.target)

      ret[item.prefix] = {
        target: item.target,
        changeOrigin: true,
        ws: true,
        ...(isHttps ? { secure: false } : {})
      }

      // 如果 pathRewrite 存在且不为空字符串，则添加路径重写规则
      // 例如：pathRewrite: "/api" 会将 /api/users 重写为 /users
      // 如果 pathRewrite 为空字符串或未设置，则保持原路径
      if (item?.pathRewrite && item.pathRewrite.trim() !== '') {
        ret[item.prefix].rewrite = path => path.replace(new RegExp(`^${item.pathRewrite}`), '')
      }
    })
  }

  return ret
}
