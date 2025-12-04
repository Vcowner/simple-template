/**
 * MxTitle 组件类型定义
 */

export interface MxTitleProps {
  /** 标题文本 */
  title?: string
  /** 尺寸大小 */
  size?: 'large' | 'middle' | 'small'
  /** 方形柱颜色，默认使用主题色 */
  color?: string
  /** 方形柱宽度 */
  barWidth?: number
  /** 方形柱位置 */
  barPosition?: 'left' | 'top'
  /** 自定义类名 */
  customClass?: string
}

export interface MxTitleEmits {
  // 如果需要事件，可以在这里定义
}
