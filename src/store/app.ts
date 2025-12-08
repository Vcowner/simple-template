/*
 * @Author: liaokt
 * @Description: 应用配置 Store
 * @Date: 2025-12-01
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { axios } from '@/utils/request'
import { useLocalStorage } from '@/hooks'
// 导入默认 logo 图片（生产环境构建后会自动处理路径）
import defaultLogo from '@/assets/images/logo/logo_blue.png'

export type NavigationMode = 'top-side' | 'side' | 'basic'

/**
 * 应用配置接口
 */
export interface AppConfig {
  logo?: string // Logo URL
  title?: string // 应用标题
  favicon?: string // Favicon URL
  loginBackground?: string // 登录背景图片 URL
  [key: string]: any // 允许其他配置项
}

/**
 * 应用配置 Store
 */
export const useAppStore = defineStore('app', () => {
  // 配置数据
  const config = ref<AppConfig>({
    logo: defaultLogo, // 默认 logo（使用导入的静态资源，生产环境会自动处理）
    favicon: '/favicon.png', // 默认 favicon
    title: import.meta.env.VITE_APP_TITLE,
    loginBackground: '@/assets/images/bg/login.png' // 默认登录背景
  })

  // 是否已加载配置
  const loaded = ref(false)

  // 导航模式
  const { value: navigationMode } = useLocalStorage<NavigationMode>('navigation-mode', 'top-side')

  /**
   * 从后端获取应用配置
   */
  const fetchConfig = async (): Promise<void> => {
    try {
      // TODO: 替换为实际的后端 API 地址
      // const response = await axios.get<AppConfig>('/api/config/app')
      // config.value = { ...config.value, ...response.data }

      // 示例：模拟 API 调用（实际使用时取消注释上面的代码）
      // 这里可以设置一个环境变量来控制是否从后端获取
      if (import.meta.env.VITE_USE_BACKEND_CONFIG === 'true') {
        const response = await axios.get<AppConfig>('/api/config/app')
        config.value = { ...config.value, ...response.data }
      }

      loaded.value = true
    } catch (error) {
      console.warn('获取应用配置失败，使用默认配置:', error)
      loaded.value = true // 即使失败也标记为已加载，使用默认配置
    }
  }

  /**
   * 更新配置
   */
  const updateConfig = (newConfig: Partial<AppConfig>): void => {
    config.value = { ...config.value, ...newConfig }
  }

  /**
   * 获取 Logo URL
   */
  const getLogoUrl = (): string => {
    return config.value.logo || defaultLogo
  }

  /**
   * 获取 Favicon URL
   */
  const getFaviconUrl = (): string => {
    return config.value.favicon || '/favicon.png'
  }

  /**
   * 获取登录背景图片 URL
   */
  const getLoginBackgroundUrl = (): string => {
    return config.value.loginBackground || '@/assets/images/bg/login.png'
  }

  /**
   * 初始化配置（应用启动时调用）
   */
  const init = async (): Promise<void> => {
    if (!loaded.value) {
      await fetchConfig()
    }
  }

  /**
   * 设置导航模式
   */
  const setNavigationMode = (mode: NavigationMode): void => {
    navigationMode.value = mode
  }

  return {
    config,
    loaded,
    navigationMode,
    fetchConfig,
    updateConfig,
    getLogoUrl,
    getFaviconUrl,
    getLoginBackgroundUrl,
    setNavigationMode,
    init
  }
})
