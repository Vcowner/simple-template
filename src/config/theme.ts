/**
 * Ant Design Vue 主题配置
 */
import { theme } from 'ant-design-vue'
import type { ThemeConfig as AntdThemeConfig } from 'ant-design-vue/es/config-provider/context'

const { defaultAlgorithm, darkAlgorithm } = theme

/**
 * 主题配置类型
 */
export type ThemeConfig = AntdThemeConfig

/**
 * 预设主题名称
 */
export type PresetThemeName =
  | 'light-blue'
  | 'light-green'
  | 'light-purple'
  | 'light-orange'
  | 'dark-blue'
  | 'dark-green'
  | 'dark-purple'

/**
 * 自定义主题参数类型
 */
export interface CustomThemeParams {
  // 主色
  colorPrimary?: string
  // 成功色
  colorSuccess?: string
  // 警告色
  colorWarning?: string
  // 错误色
  colorError?: string
  // 信息色
  colorInfo?: string
  // 字体大小
  fontSize?: number
  // 圆角
  borderRadius?: number
  // 组件高度
  controlHeight?: number
}

/**
 * 默认主题配置
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const defaultTheme: ThemeConfig = {
  algorithm: defaultAlgorithm,
  token: {
    colorPrimary: '#2f54eb',
    // 主题色
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    colorInfo: '#2f54eb',

    // 字体
    fontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
    'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
    'Noto Color Emoji'`,
    fontSize: 14,
    fontSizeHeading1: 38,
    fontSizeHeading2: 30,
    fontSizeHeading3: 24,
    fontSizeHeading4: 20,
    fontSizeHeading5: 16,

    // 圆角
    borderRadius: 6,
    borderRadiusLG: 8,
    borderRadiusSM: 4,

    // 间距
    padding: 16,
    paddingLG: 24,
    paddingSM: 12,
    paddingXS: 8,
    paddingXXS: 4
  },
  components: {
    // Button 组件配置
    Button: {
      borderRadius: 6,
      controlHeight: 32
    },
    // Input 组件配置
    Input: {
      borderRadius: 6,
      controlHeight: 32
    },
    // Card 组件配置
    Card: {
      borderRadius: 8,
      paddingLG: 24
    },
    // Table 组件配置
    Table: {
      borderRadius: 8
    },
    // Menu 组件配置
    Menu: {
      borderRadius: 6
    }
  }
}

/**
 * 暗色主题配置
 * 注意：darkAlgorithm 会自动处理暗色背景和文字颜色
 * 我们只需要继承默认配置，然后覆盖颜色相关配置
 */
export const darkTheme: ThemeConfig = {
  algorithm: darkAlgorithm,
  token: {
    ...defaultTheme.token, // 继承所有默认配置（包括字体大小、圆角、间距等）
    colorPrimary: '#177ddc',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    colorInfo: '#177ddc'
  },
  components: {
    ...defaultTheme.components // 继承所有默认组件配置（包括组件高度、圆角等）
  }
}

/**
 * 预设主题配置映射
 */
export const presetThemes: Record<PresetThemeName, ThemeConfig> = {
  // 浅色主题 - 蓝色（默认）
  'light-blue': defaultTheme,
  // 浅色主题 - 绿色
  'light-green': {
    algorithm: defaultAlgorithm,
    token: {
      ...defaultTheme.token,
      colorPrimary: '#52c41a',
      colorInfo: '#52c41a'
    },
    components: defaultTheme.components
  },
  // 浅色主题 - 紫色
  'light-purple': {
    algorithm: defaultAlgorithm,
    token: {
      ...defaultTheme.token,
      colorPrimary: '#722ed1',
      colorInfo: '#722ed1'
    },
    components: defaultTheme.components
  },
  // 浅色主题 - 橙色
  'light-orange': {
    algorithm: defaultAlgorithm,
    token: {
      ...defaultTheme.token,
      colorPrimary: '#fa8c16',
      colorInfo: '#fa8c16'
    },
    components: defaultTheme.components
  },
  // 暗色主题 - 蓝色
  'dark-blue': darkTheme,
  // 暗色主题 - 绿色
  'dark-green': {
    algorithm: darkAlgorithm,
    token: {
      ...darkTheme.token,
      colorPrimary: '#52c41a',
      colorInfo: '#52c41a'
    },
    components: darkTheme.components
  },
  // 暗色主题 - 紫色
  'dark-purple': {
    algorithm: darkAlgorithm,
    token: {
      ...darkTheme.token,
      colorPrimary: '#9254de',
      colorInfo: '#9254de'
    },
    components: darkTheme.components
  }
}

/**
 * 获取预设主题配置
 */
export function getPresetTheme(name: PresetThemeName): ThemeConfig {
  return presetThemes[name] || defaultTheme
}

/**
 * 合并自定义主题参数到主题配置
 */
export function mergeThemeConfig(
  baseTheme: ThemeConfig,
  customParams: CustomThemeParams
): ThemeConfig {
  const merged: ThemeConfig = {
    ...baseTheme,
    token: {
      ...baseTheme.token,
      ...(customParams.colorPrimary && { colorPrimary: customParams.colorPrimary }),
      ...(customParams.colorSuccess && { colorSuccess: customParams.colorSuccess }),
      ...(customParams.colorWarning && { colorWarning: customParams.colorWarning }),
      ...(customParams.colorError && { colorError: customParams.colorError }),
      ...(customParams.colorInfo && { colorInfo: customParams.colorInfo }),
      ...(customParams.fontSize !== undefined && { fontSize: customParams.fontSize }),
      ...(customParams.borderRadius !== undefined && { borderRadius: customParams.borderRadius })
    },
    components: {
      ...baseTheme.components,
      ...(customParams.controlHeight !== undefined && {
        Button: {
          ...baseTheme.components?.Button,
          controlHeight: customParams.controlHeight
        },
        Input: {
          ...baseTheme.components?.Input,
          controlHeight: customParams.controlHeight
        }
      }),
      ...(customParams.borderRadius !== undefined && {
        Button: {
          ...baseTheme.components?.Button,
          borderRadius: customParams.borderRadius
        },
        Input: {
          ...baseTheme.components?.Input,
          borderRadius: customParams.borderRadius
        },
        Card: {
          ...baseTheme.components?.Card,
          borderRadius: customParams.borderRadius + 2
        },
        Table: {
          ...baseTheme.components?.Table,
          borderRadius: customParams.borderRadius + 2
        },
        Menu: {
          ...baseTheme.components?.Menu,
          borderRadius: customParams.borderRadius
        }
      })
    }
  }

  return merged
}
