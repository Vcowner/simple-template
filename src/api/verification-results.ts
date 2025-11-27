/*
 * @Author: liaokt
 * @Description: 验证结果相关接口
 * @Date: 2025-11-27
 */
import { request } from '@/utils/request'
import type { Result } from '@/types/api'
import type { AxiosResponse } from 'axios'

/**
 * 验证结果信息类型
 */
export interface VerificationResult {
  id: number | string
  batch_id?: number
  device_id?: string
  device_name: string
  actual_device_type?: string
  actual_type?: string // 兼容旧字段
  model_recognition_type?: string
  model_type?: string // 兼容旧字段
  recognition_result?: string
  result?: string // 兼容旧字段
  recognition_accuracy?: number
  accuracy?: number | string // 兼容旧字段
  verification_time?: string
  validation_time?: string // 兼容旧字段
  created_at?: string
}

/**
 * 验证设备响应类型
 */
export interface VerifyDeviceResponse {
  batch_id: number
  total: number
  success_count: number
  failed_count: number
  results: VerificationResult[]
}

export interface VerificationResultListResponse extends Result<VerificationResult[]> {
  total?: number
  pageSize?: number
  pageCount?: number
  current?: number
}

/**
 * 验证设备参数类型
 */
export interface VerifyDeviceParams {
  device_names: string[]
}

/**
 * 获取验证结果列表
 * @param params 查询参数（可选，包括分页和筛选参数）
 */
export const getVerificationResultsList = (
  params?: Record<string, any>
): Promise<VerificationResultListResponse> => {
  return request.get<VerificationResultListResponse>('/verification-results/', {
    params
  })
}

/**
 * 验证设备
 * @param params 包含 device_names 数组的参数对象
 */
export const verifyDevice = (
  params?: VerifyDeviceParams
): Promise<Result<VerifyDeviceResponse>> => {
  if (!params || !params.device_names || params.device_names.length === 0) {
    throw new Error('设备名称不能为空')
  }
  return request.post<Result<VerifyDeviceResponse>>('/verification-results/verify_device/', params)
}

/**
 * 导出 Excel
 * @param params 查询参数（可选）
 */
export const exportVerificationResultsExcel = async (
  params?: Record<string, any>
): Promise<Blob> => {
  const response = (await request.get<AxiosResponse<Blob>>('/verification-results/export_excel/', {
    params,
    responseType: 'blob'
  })) as AxiosResponse<Blob>
  // 响应拦截器对于 blob 响应返回的是整个 response 对象，需要提取 data
  return response.data
}
