/*
 * @Author: liaokt
 * @Description: 指标卡片组件类型定义
 * @Date: 2025-12-15
 */

/**
 * 对比指标趋势
 */
export type TrendType = 'up' | 'down'

/**
 * 对比指标配置
 */
export interface ComparisonItem {
  /** 标签文本，如"周同比"、"日同比" */
  label: string
  /** 数值，如 12 表示 12% */
  value: number | string
  /** 趋势方向 */
  trend: TrendType
  /** 自定义颜色，不传则使用默认颜色（上升红色，下降绿色） */
  color?: string
}

/**
 * 指标卡片 Props
 */
export interface MxMetricCardProps {
  /** 标题 */
  title: string
  /** 主要数值 */
  value: string | number
  /** 数值前缀，如 "¥" */
  prefix?: string
  /** 数值后缀 */
  suffix?: string
  /** 是否显示信息图标 */
  showInfoIcon?: boolean
  /** 自定义图标组件，不传则使用默认的 InfoCircleOutlined */
  icon?: any
  /** 对比指标列表 */
  comparisons?: ComparisonItem[]
  /** 自定义类名 */
  customClass?: string
}

/**
 * 指标卡片事件
 */
export interface MxMetricCardEmits {
  /** 点击信息图标时触发 */
  (e: 'infoClick'): void
  /** 点击卡片时触发 */
  (e: 'click'): void
}
