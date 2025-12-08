/**
 * MxResponsiveContainer 组件类型定义
 */

export interface MxResponsiveContainerProps {
  /** 内边距 */
  padding?: number | string
  /** 是否启用滚动 */
  scrollable?: boolean
  /** 滚动方向 */
  scrollDirection?: 'x' | 'y' | 'both' | 'none'
  /** 背景色 */
  backgroundColor?: string
  /** 自定义类名 */
  customClass?: string
  /** Flex 布局方向 */
  flexDirection?: 'row' | 'column'
  /** Flex 对齐方式 */
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline'
  /** Flex 内容对齐方式 */
  justifyContent?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'space-evenly'
  /** 是否使用 Flex 布局 */
  flex?: boolean
  /** 最小宽度 */
  minWidth?: number | string
  /** 最小高度 */
  minHeight?: number | string
  /** 最大宽度 */
  maxWidth?: number | string
  /** 最大高度 */
  maxHeight?: number | string
}

export interface MxResponsiveContainerEmits {
  // 如果需要事件，可以在这里定义
}
