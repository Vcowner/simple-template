/*
 * @Author: liaokt
 * @Description: 设备指纹相关接口
 * @Date: 2025-11-27
 */
import { request } from '@/utils/request'
import type { Result } from '@/types/api'

/**
 * 包级特征显示对象
 */
export interface PacketFeaturesDisplay {
  id: number
  device_type_display: string
  feature_id: string
  packet_size: string
  tcp_window_size: string
  port_number: number
  mac_address: string
  dns_domain: string | null
  http_response: string | null
  device_type: string
  created_at: string
}

/**
 * 流级特征显示对象
 */
export interface FlowFeaturesDisplay {
  id: number
  ip_version_display: string
  related_rule_name: string
  tcp_flags_list: string[]
  feature_id: string
  data_flow_length: number
  duration: number
  tcp_flags: string
  ip_version: string
  created_at: string
  related_rule: number
}

/**
 * 设备指纹信息类型
 */
export interface DeviceFingerprint {
  id: number
  fingerprint_id: string
  device_name: string
  device_type: string
  device_type_display: string
  packet_features: string
  flow_features: string
  packet_features_display?: PacketFeaturesDisplay
  flow_features_display?: FlowFeaturesDisplay
  related_model_id: string
  created_at: string
  updated_at: string
}

export interface DeviceFingerprintListResponse extends Result<DeviceFingerprint[]> {
  total?: number
  pageSize?: number
  pageCount?: number
  current?: number
}

/**
 * 获取设备指纹详情参数类型
 */
export interface GetDeviceFingerprintDetailParams {
  id: number
}

/**
 * 获取设备指纹列表
 * @param params 查询参数（可选，包括分页和筛选参数）
 */
export const getDeviceFingerprintsList = (
  params?: Record<string, any>
): Promise<DeviceFingerprintListResponse> => {
  return request.get<DeviceFingerprintListResponse>('/device-fingerprints/', {
    params
  })
}

/**
 * 获取设备指纹详情
 * @param params 包含 id 的参数对象
 */
export const getDeviceFingerprintDetail = (
  params?: GetDeviceFingerprintDetailParams
): Promise<Result<DeviceFingerprint>> => {
  if (!params?.id) {
    throw new Error('指纹ID不能为空')
  }
  return request.get<Result<DeviceFingerprint>>(`/device-fingerprints/${params.id}/`)
}
