/*
 * @Author: liaokt
 * @Description:
 * @Date: 2025-11-06 10:01:35
 * @LastEditors: liaokt
 * @LastEditTime: 2025-12-04 10:06:08
 */
/**
 * 主题 Store
 */
import { defineStore } from 'pinia'
import { computed } from 'vue'
import { theme } from 'ant-design-vue'
import type { ThemeConfig, PresetThemeName, CustomThemeParams } from '@/config/theme'
import { getPresetTheme, mergeThemeConfig, presetThemes } from '@/config/theme'
import { useLocalStorage } from '@/hooks'

const { compactAlgorithm } = theme

export type ThemeMode = 'light' | 'dark'
export type DensityMode = 'default' | 'compact'

export const useThemeStore = defineStore('theme', () => {
  // 预设主题名称
  const { value: presetThemeName } = useLocalStorage<PresetThemeName>(
    'preset-theme-name',
    'light-blue'
  )

  // 自定义主题参数
  const { value: customThemeParams } = useLocalStorage<CustomThemeParams>('custom-theme-params', {})

  // 是否使用自定义主题
  const { value: useCustomTheme } = useLocalStorage<boolean>('use-custom-theme', false)

  // 紧凑模式
  const { value: densityMode } = useLocalStorage<DensityMode>('density-mode', 'default')

  // 当前使用的预设主题配置
  const currentPresetTheme = computed<ThemeConfig>(() => {
    return getPresetTheme(presetThemeName.value)
  })

  // 最终主题配置（合并预设主题和自定义参数，并应用紧凑模式）
  const themeConfig = computed<ThemeConfig>(() => {
    let baseTheme = currentPresetTheme.value

    // 如果使用自定义主题且有自定义参数，则合并
    if (useCustomTheme.value && Object.keys(customThemeParams.value).length > 0) {
      baseTheme = mergeThemeConfig(baseTheme, customThemeParams.value)
    }

    // 如果启用紧凑模式，应用 compactAlgorithm
    if (densityMode.value === 'compact') {
      const baseAlgorithm = baseTheme.algorithm
      // 如果已有算法（可能是数组或单个算法），需要组合
      if (Array.isArray(baseAlgorithm)) {
        return {
          ...baseTheme,
          algorithm: [...baseAlgorithm, compactAlgorithm]
        }
      } else if (baseAlgorithm) {
        return {
          ...baseTheme,
          algorithm: [baseAlgorithm, compactAlgorithm]
        }
      } else {
        return {
          ...baseTheme,
          algorithm: compactAlgorithm
        }
      }
    }

    return baseTheme
  })

  // 设置预设主题
  const setPresetTheme = (name: PresetThemeName) => {
    presetThemeName.value = name
    useCustomTheme.value = false // 切换预设主题时关闭自定义主题
  }

  // 设置自定义主题参数
  const setCustomThemeParams = (params: CustomThemeParams) => {
    customThemeParams.value = { ...customThemeParams.value, ...params }
    useCustomTheme.value = true // 设置自定义参数时自动启用自定义主题
  }

  // 重置自定义主题参数
  const resetCustomThemeParams = () => {
    customThemeParams.value = {}
    useCustomTheme.value = false
  }

  // 启用/禁用自定义主题
  const toggleCustomTheme = (enabled?: boolean) => {
    useCustomTheme.value = enabled !== undefined ? enabled : !useCustomTheme.value
  }

  // 获取所有可用的预设主题名称
  const getAvailablePresetThemes = (): PresetThemeName[] => {
    return Object.keys(presetThemes) as PresetThemeName[]
  }

  // 获取预设主题的显示名称
  const getPresetThemeDisplayName = (name: PresetThemeName): string => {
    const nameMap: Record<PresetThemeName, string> = {
      'light-blue': '浅色-蓝色',
      'light-green': '浅色-绿色',
      'light-purple': '浅色-紫色',
      'light-orange': '浅色-橙色',
      'dark-blue': '暗色-蓝色',
      'dark-green': '暗色-绿色',
      'dark-purple': '暗色-紫色'
    }
    return nameMap[name] || name
  }

  // 兼容旧的主题模式 API（保持向后兼容）
  const themeMode = computed<ThemeMode>(() => {
    if (presetThemeName.value.startsWith('dark')) return 'dark'
    return 'light'
  })

  const setThemeMode = (mode: ThemeMode) => {
    // 根据模式设置对应的预设主题
    const modeThemes: Record<ThemeMode, PresetThemeName> = {
      light: 'light-blue',
      dark: 'dark-blue'
    }
    setPresetTheme(modeThemes[mode])
  }

  const toggleTheme = () => {
    const modes: ThemeMode[] = ['light', 'dark']
    const currentIndex = modes.indexOf(themeMode.value)
    const nextIndex = (currentIndex + 1) % modes.length
    setThemeMode(modes[nextIndex])
  }

  // 是否为暗色主题
  const isDark = computed(() => themeMode.value === 'dark')

  // 设置紧凑模式
  const setDensityMode = (mode: DensityMode) => {
    densityMode.value = mode
  }

  return {
    // 新 API
    presetThemeName,
    customThemeParams,
    useCustomTheme,
    themeConfig,
    setPresetTheme,
    setCustomThemeParams,
    resetCustomThemeParams,
    toggleCustomTheme,
    getAvailablePresetThemes,
    getPresetThemeDisplayName,
    // 紧凑模式 API
    densityMode,
    setDensityMode,
    // 兼容旧 API
    themeMode,
    setThemeMode,
    toggleTheme,
    isDark
  }
})
