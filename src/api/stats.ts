/*
 * @Author: liaokt
 * @Description: 统计数据相关接口
 * @Date: 2025-11-27
 */
import { request } from '@/utils/request'
import type { Result } from '@/types/api'

/**
 * 统计数据响应类型
 */
export interface StatsData {
  flow_feature_count: number
  device_fingerprint_count: number
  verification_batch_counts: number
}

/**
 * 获取统计数据
 */
export const getStats = (): Promise<Result<StatsData>> => {
  return request.get<Result<StatsData>>('/stats/')
}
