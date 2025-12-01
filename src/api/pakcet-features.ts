/*
 * @Author: liaokt
 * @Description: 包级特征相关接口
 * @Date: 2025-11-26
 */
import { request } from '@/utils/request'
import type { ListResponse, Result } from '@/types/api'

/**
 * 包级特征信息类型
 */
export interface PacketFeature {
  id: number
  feature_id: string
  packet_size: string
  tcp_window_size: string
  port_number: number
  mac_address: string
  dns_domain: string | null
  http_response: string | null
  device_type: string
  device_type_display: string
  created_at: string
}

/**
 * 创建包级特征参数类型
 */
export interface CreatePacketFeatureParams {
  feature_id?: string
  packet_size: string
  tcp_window_size: string
  port_number: number
  mac_address: string
  dns_domain?: string | null
  http_response?: string | null
  device_type: string
}

/**
 * 更新包级特征参数类型
 */
export interface UpdatePacketFeatureParams extends Partial<CreatePacketFeatureParams> {
  id: number
}

/**
 * 获取包级特征列表
 * @param params 查询参数（可选，包括分页和筛选参数）
 */
export const getPacketFeaturesList = (
  params?: Record<string, any>
): Promise<ListResponse<PacketFeature>> => {
  return request.get<ListResponse<PacketFeature>>('/packet-features/', {
    params
  })
}

/**
 * 获取包级特征详情参数类型（用于 useRequest）
 */
export interface GetPacketFeatureDetailParams {
  id: number
}

/**
 * 获取包级特征详情
 * @param params 包含 id 的参数对象
 */
export const getPacketFeatureDetail = (
  params?: GetPacketFeatureDetailParams
): Promise<Result<PacketFeature>> => {
  if (!params?.id) {
    throw new Error('详情ID不能为空')
  }
  return request.get<Result<PacketFeature>>(`/packet-features/${params.id}/`)
}

/**
 * 新增包级特征参数类型（用于 useRequest）
 */
export interface CreatePacketFeatureRequestParams {
  data: CreatePacketFeatureParams
}

/**
 * 更新包级特征参数类型（用于 useRequest）
 */
export interface UpdatePacketFeatureRequestParams {
  id: number
  data: Partial<CreatePacketFeatureParams>
}

/**
 * 新增包级特征
 * @param params 包含 data 的参数对象
 */
export const createPacketFeature = (
  params?: CreatePacketFeatureRequestParams
): Promise<Result<PacketFeature>> => {
  if (!params?.data) {
    throw new Error('创建数据不能为空')
  }
  return request.post<Result<PacketFeature>>('/packet-features/', params.data)
}

/**
 * 更新包级特征
 * @param params 包含 id 和 data 的参数对象
 */
export const updatePacketFeature = (
  params?: UpdatePacketFeatureRequestParams
): Promise<Result<PacketFeature>> => {
  if (!params?.id) {
    throw new Error('更新ID不能为空')
  }
  if (!params?.data) {
    throw new Error('更新数据不能为空')
  }
  return request.put<Result<PacketFeature>>(`/packet-features/${params.id}/`, params.data)
}

/**
 * 删除包级特征参数类型
 */
export interface DeletePacketFeatureParams {
  id: number
}

/**
 * 删除包级特征
 * @param params 删除参数，包含 id
 */
export const deletePacketFeature = (params?: DeletePacketFeatureParams): Promise<Result<void>> => {
  if (!params?.id) {
    throw new Error('删除ID不能为空')
  }
  return request.delete<Result<void>>(`/packet-features/${params.id}/`)
}
