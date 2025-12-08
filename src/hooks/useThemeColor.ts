/**
 * 主题颜色相关的 Hooks
 */
import { computed } from 'vue'
import { useThemeStore } from '@/store/theme'

/**
 * 将十六进制颜色转换为 RGB 值
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      }
    : null
}

/**
 * 调整颜色亮度
 * @param color 颜色值（十六进制或 RGB）
 * @param factor 亮度因子，> 1 提亮，< 1 变暗
 * @returns 调整后的 RGB 颜色字符串
 */
function adjustColorBrightness(color: string, factor: number): string {
  if (color.startsWith('#')) {
    const rgb = hexToRgb(color)
    if (rgb) {
      const r = Math.max(0, Math.min(255, Math.floor(rgb.r * factor)))
      const g = Math.max(0, Math.min(255, Math.floor(rgb.g * factor)))
      const b = Math.max(0, Math.min(255, Math.floor(rgb.b * factor)))
      return `rgb(${r}, ${g}, ${b})`
    }
  }
  return color
}

/**
 * 将颜色转换为 RGBA 格式
 * @param color 颜色值（十六进制或 RGB）
 * @param alpha 透明度（0-1）
 * @returns RGBA 颜色字符串
 */
function colorToRgba(color: string, alpha: number): string {
  if (color.startsWith('#')) {
    const rgb = hexToRgb(color)
    if (rgb) {
      return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`
    }
  }
  // 如果已经是 rgb 格式，尝试提取 RGB 值
  const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/)
  if (rgbMatch) {
    return `rgba(${rgbMatch[1]}, ${rgbMatch[2]}, ${rgbMatch[3]}, ${alpha})`
  }
  return `rgba(24, 144, 255, ${alpha})` // 默认颜色
}

/**
 * 将颜色转换为现代 CSS 格式的 RGB（带透明度）
 * @param color 颜色值（十六进制或 RGB）
 * @param alpha 透明度（0-1）
 * @returns 现代格式的 RGB 颜色字符串，如：rgb(47 84 235 / 30%)
 */
function colorToRgbWithAlpha(color: string, alpha: number): string {
  if (color.startsWith('#')) {
    const rgb = hexToRgb(color)
    if (rgb) {
      const alphaPercent = Math.round(alpha * 100)
      return `rgb(${rgb.r} ${rgb.g} ${rgb.b} / ${alphaPercent}%)`
    }
  }
  // 如果已经是 rgb 格式，尝试提取 RGB 值
  const rgbMatch = color.match(/rgb\((\d+)[,\s]+(\d+)[,\s]+(\d+)/)
  if (rgbMatch) {
    const alphaPercent = Math.round(alpha * 100)
    return `rgb(${rgbMatch[1]} ${rgbMatch[2]} ${rgbMatch[3]} / ${alphaPercent}%)`
  }
  const alphaPercent = Math.round(alpha * 100)
  return `rgb(47 84 235 / ${alphaPercent}%)` // 默认颜色
}

/**
 * 使用主题颜色的 Hooks
 * @returns 主题颜色相关的计算属性
 */
export function useThemeColor() {
  const themeStore = useThemeStore()

  // 获取主题主色
  const primaryColor = computed(() => {
    const color = themeStore.themeConfig.token?.colorPrimary
    return (typeof color === 'string' ? color : '#1890ff') || '#1890ff'
  })

  // 计算 hover 状态的颜色（提亮 15%）
  const hoverColor = computed(() => {
    return adjustColorBrightness(primaryColor.value, 1.15)
  })

  // 计算 active 状态的颜色（加深 30%）
  const activeColor = computed(() => {
    return adjustColorBrightness(primaryColor.value, 0.7)
  })

  // 计算打开状态的颜色（加深 20%）
  const openColor = computed(() => {
    return adjustColorBrightness(primaryColor.value, 0.8)
  })

  // 计算 hover 背景色（rgba 透明度版本，常用于背景色）
  const hoverBgColor = computed(() => {
    return colorToRgba(primaryColor.value, 0.1)
  })

  // 计算 active 背景色（rgba 透明度版本）
  const activeBgColor = computed(() => {
    return colorToRgba(primaryColor.value, 0.2)
  })

  // 计算阴影颜色（现代 CSS 格式，用于 box-shadow）
  const shadowColor = computed(() => (alpha: number) => {
    return colorToRgbWithAlpha(primaryColor.value, alpha)
  })

  // 常用的阴影颜色
  const shadowColor30 = computed(() => colorToRgbWithAlpha(primaryColor.value, 0.3))
  const shadowColor40 = computed(() => colorToRgbWithAlpha(primaryColor.value, 0.4))

  return {
    primaryColor,
    hoverColor,
    activeColor,
    openColor,
    hoverBgColor,
    activeBgColor,
    shadowColor,
    shadowColor30,
    shadowColor40
  }
}
