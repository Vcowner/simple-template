/*
 * @Author: liaokt
 * @Description: 图表组件类型定义
 * @Date: 2025-12-15
 */

/**
 * 图表类型
 */
export type ChartType = 'column' | 'bar' | 'line' | 'area' | 'pie' | 'scatter' | 'gauge'

/**
 * 图表数据项
 */
export interface ChartDataItem {
  [key: string]: any
}

/**
 * 图表配置
 */
export interface ChartConfig {
  /** X 轴字段名 */
  xField?: string
  /** Y 轴字段名 */
  yField?: string
  /** 分组字段名（用于堆叠图、分组图） */
  seriesField?: string
  /** 角度字段名（用于饼图） */
  angleField?: string
  /** 颜色字段名（用于饼图） */
  colorField?: string
  /** 半径字段名（用于饼图） */
  radiusField?: string
  /** 指标字段名（用于仪表盘） */
  indicatorField?: string
  /** 指标值字段名（用于仪表盘） */
  valueField?: string
  /** 自定义配置，会合并到 G2 的 options 中 */
  options?: Record<string, any>
}

/**
 * 图表组件 Props
 */
export interface MxChartProps {
  /** 图表类型 */
  type: ChartType
  /** 图表数据 */
  data: ChartDataItem[]
  /** 图表配置 */
  config?: ChartConfig
  /** 图表高度（默认 300） */
  height?: number
  /** 图表宽度（默认自适应） */
  width?: number
  /** 是否自适应容器大小 */
  autoFit?: boolean
  /** 自定义类名 */
  customClass?: string
}

/**
 * 图表组件事件
 */
export interface MxChartEmits {
  /** 图表渲染完成 */
  (e: 'ready', chart: any): void
  /** 图表元素点击 */
  (e: 'elementClick', data: any): void
}
