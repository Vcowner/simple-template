/*
 * @Author: liaokt
 * @Description: 模型训练指标相关接口
 * @Date: 2025-11-27
 */
import { request } from '@/utils/request'
import type { Result } from '@/types/api'

/**
 * 计算训练指标参数类型
 */
export interface CalculateMetricsParams {
  training_count: number
  training_ratio: number
}

/**
 * 训练指标响应类型
 */
export interface TrainingMetrics {
  accuracy: string
  recall: string
  f1_score: string
  training_count: number
  training_ratio: number
}

/**
 * 计算训练指标
 * @param params 训练参数
 */
export const calculateMetrics = (
  params?: CalculateMetricsParams
): Promise<Result<TrainingMetrics>> => {
  if (!params) {
    throw new Error('训练参数不能为空')
  }
  return request.post<Result<TrainingMetrics>>('/training-metrics/calculate_metrics/', params)
}
