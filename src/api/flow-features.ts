/*
 * @Author: liaokt
 * @Description: 流级特征相关接口
 * @Date: 2025-11-27
 */
import { request } from '@/utils/request'
import type { Result } from '@/types/api'

/**
 * 流级特征信息类型
 */
export interface FlowFeature {
  id: number
  feature_id: string
  data_flow_length: number
  duration: number
  tcp_flags: string
  tcp_flags_list: string[]
  ip_version: string
  ip_version_display: string
  related_rule: number
  related_rule_name: string
  created_at: string
}

export interface FlowFeatureListResponse extends Result<FlowFeature[]> {
  total?: number
  pageSize?: number
  pageCount?: number
  current?: number
}

/**
 * 创建流级特征参数类型
 */
export interface CreateFlowFeatureParams {
  data_flow_length: number
  duration: number
  tcp_flags: string[]
  ip_version: string
  related_rule: number
}

/**
 * 更新流级特征参数类型
 */
export interface UpdateFlowFeatureParams extends Partial<CreateFlowFeatureParams> {
  id: number
}

/**
 * 删除流级特征参数类型
 */
export interface DeleteFlowFeatureParams {
  id: number
}

/**
 * 获取流级特征详情参数类型
 */
export interface GetFlowFeatureDetailParams {
  id: number
}

/**
 * 获取流级特征列表
 * @param params 查询参数（可选，包括分页和筛选参数）
 */
export const getFlowFeaturesList = (
  params?: Record<string, any>
): Promise<FlowFeatureListResponse> => {
  return request.get<FlowFeatureListResponse>('/flow-features/', {
    params
  })
}

/**
 * 获取流级特征详情
 * @param params 包含 id 的参数对象
 */
export const getFlowFeatureDetail = (
  params?: GetFlowFeatureDetailParams
): Promise<Result<FlowFeature>> => {
  if (!params?.id) {
    throw new Error('特征ID不能为空')
  }
  return request.get<Result<FlowFeature>>(`/flow-features/${params.id}/`)
}

/**
 * 新增流级特征
 * @param params 创建参数
 */
export const createFlowFeature = (
  params?: CreateFlowFeatureParams
): Promise<Result<FlowFeature>> => {
  if (!params) {
    throw new Error('创建参数不能为空')
  }
  return request.post<Result<FlowFeature>>('/flow-features/', params)
}

/**
 * 更新流级特征
 * @param params 更新参数，包含 id
 */
export const updateFlowFeature = (
  params?: UpdateFlowFeatureParams
): Promise<Result<FlowFeature>> => {
  if (!params?.id) {
    throw new Error('更新特征ID不能为空')
  }
  return request.put<Result<FlowFeature>>(`/flow-features/${params.id}/`, params)
}

/**
 * 删除流级特征
 * @param params 删除参数，包含 id
 */
export const deleteFlowFeature = (params?: DeleteFlowFeatureParams): Promise<Result<void>> => {
  if (!params?.id) {
    throw new Error('删除特征ID不能为空')
  }
  return request.delete<Result<void>>(`/flow-features/${params.id}/`)
}
