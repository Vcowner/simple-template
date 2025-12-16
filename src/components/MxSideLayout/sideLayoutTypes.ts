/*
 * @Author: liaokt
 * @Description: 侧边布局组件类型定义
 * @Date: 2025-12-15
 */

/**
 * 侧边布局组件 Props
 */
export interface MxSideLayoutProps {
  /** 左侧宽度（默认 280px） */
  leftWidth?: number | string
  /** 右侧宽度（默认 auto） */
  rightWidth?: number | string
  /** 是否可调整宽度（默认 false） */
  resizable?: boolean
  /** 是否可折叠左侧面板（默认 false） */
  collapsible?: boolean
  /** 左侧面板是否折叠（默认 false） */
  collapsed?: boolean
  /** 左侧面板标题 */
  leftTitle?: string
  /** 左侧面板最小宽度（默认 200px） */
  leftMinWidth?: number
  /** 左侧面板最大宽度（默认 400px） */
  leftMaxWidth?: number
  /** 自定义类名 */
  customClass?: string
}

/**
 * 侧边布局组件事件
 */
export interface MxSideLayoutEmits {
  /** 折叠状态变化 */
  (e: 'collapseChange', collapsed: boolean): void
  /** v-model:collapsed 支持 */
  (e: 'update:collapsed', collapsed: boolean): void
  /** 左侧宽度变化（当 resizable 为 true 时） */
  (e: 'widthChange', width: number): void
}
