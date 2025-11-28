/*
 * @Author: liaokt
 * @Description:
 * @Date: 2025-11-10 15:26:49
 * @LastEditors: liaokt
 * @LastEditTime: 2025-11-12 09:59:44
 */
/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// JSX 类型声明
declare namespace JSX {
  interface IntrinsicElements {
    [elem: string]: any
  }
}

declare module 'vue-router'

/**
 * 环境变量类型定义
 */
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_ENV: 'development' | 'production' | 'test'
  // 可以添加更多环境变量
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
