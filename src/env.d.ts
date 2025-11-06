/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

/**
 * 环境变量类型定义
 */
interface ImportMetaEnv {
  readonly VITE_BASE_URL: string
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_ENV: 'development' | 'production' | 'test'
  // 可以添加更多环境变量
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
