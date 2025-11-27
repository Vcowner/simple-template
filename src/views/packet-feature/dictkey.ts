/*
 * @Author: liaokt
 * @Description: 包级特征数据字典和选项配置
 * @Date: 2025-11-26
 */

/**
 * 设备类型枚举值
 */
export enum DeviceType {
  SMART_METER = 'smart_meter',
  DISTRIBUTION_TERMINAL = 'distribution_terminal',
  COLLECTOR = 'collector',
  OTHER = 'other'
}

/**
 * 设备类型选项（用于下拉选择）
 */
export const DEVICE_TYPE_OPTIONS: { key: string; value: string }[] = [
  { key: 'all', value: '全部设备' },
  { key: DeviceType.SMART_METER, value: '智能电表' },
  { key: DeviceType.DISTRIBUTION_TERMINAL, value: '配电终端' },
  { key: DeviceType.COLLECTOR, value: '采集器' },
  { key: DeviceType.OTHER, value: '其他' }
]

/**
 * 设备类型字典（用于显示文本映射）
 */
export const DEVICE_TYPE_DICT: Record<string, string> = {
  [DeviceType.SMART_METER]: '智能电表',
  [DeviceType.DISTRIBUTION_TERMINAL]: '配电终端',
  [DeviceType.COLLECTOR]: '采集器',
  [DeviceType.OTHER]: '其他'
}
