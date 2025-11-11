/**
 * Ant Design Vue 主题配置
 */
import { theme } from 'ant-design-vue'
import type { ThemeConfig as AntdThemeConfig } from 'ant-design-vue/es/config-provider/context'

const { defaultAlgorithm, darkAlgorithm, compactAlgorithm } = theme

/**
 * 主题配置类型
 */
export type ThemeConfig = AntdThemeConfig

/**
 * 默认主题配置
 */
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
 */
export const darkTheme: ThemeConfig = {
  algorithm: darkAlgorithm,
  token: {
    colorPrimary: '#177ddc',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    colorInfo: '#177ddc',
    borderRadius: 6
  },
  components: {
    Button: {
      borderRadius: 6,
      controlHeight: 32
    },
    Input: {
      borderRadius: 6,
      controlHeight: 32
    }
  }
}

/**
 * 紧凑主题配置
 */
export const compactTheme: ThemeConfig = {
  algorithm: compactAlgorithm,
  token: {
    colorPrimary: '#1d39c4',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    colorInfo: '#1677ff'
  }
}
