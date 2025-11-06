/**
 * 主题 Store
 */
import { defineStore } from 'pinia'
import { computed } from 'vue'
import type { ThemeConfig } from '@/config/theme'
import { defaultTheme, darkTheme, compactTheme } from '@/config/theme'
import { useLocalStorage } from '@/hooks'

export type ThemeMode = 'light' | 'dark' | 'compact'

export const useThemeStore = defineStore('theme', () => {
  // 主题模式
  const { value: themeMode } = useLocalStorage<ThemeMode>('theme-mode', 'light')

  // 主题配置
  const themeConfig = computed<ThemeConfig>(() => {
    switch (themeMode.value) {
      case 'dark':
        return darkTheme
      case 'compact':
        return compactTheme
      default:
        return defaultTheme
    }
  })

  // 设置主题模式
  const setThemeMode = (mode: ThemeMode) => {
    themeMode.value = mode
  }

  // 切换主题
  const toggleTheme = () => {
    const modes: ThemeMode[] = ['light', 'dark', 'compact']
    const currentIndex = modes.indexOf(themeMode.value)
    const nextIndex = (currentIndex + 1) % modes.length
    themeMode.value = modes[nextIndex]
  }

  // 是否为暗色主题
  const isDark = computed(() => themeMode.value === 'dark')

  // 是否为紧凑主题
  const isCompact = computed(() => themeMode.value === 'compact')

  return {
    themeMode,
    themeConfig,
    isDark,
    isCompact,
    setThemeMode,
    toggleTheme
  }
})
