/*
 * @Author: liaokt
 * @Description: 数据流测量规则接口
 * @Date: 2025-11-26
 */
import { request } from '@/utils/request'
import type { Result } from '@/types/api'

export interface FlowRule {
  id: number
  rule_id: string
  rule_name: string
  measure_length: string
  threshold_range: string
  created_at: string
}

export interface FlowRuleListResponse extends Result<FlowRule[]> {
  total?: number
  pageSize?: number
  pageCount?: number
  current?: number
}

export interface CreateFlowRuleParams {
  rule_name: string
  measure_length: string
  threshold_range: string
}

export interface UpdateFlowRuleParams extends Partial<CreateFlowRuleParams> {
  id: number
}

export interface DeleteFlowRuleParams {
  id: number
}

export interface GetFlowRuleDetailParams {
  id: number
}

export const getFlowRulesList = (params?: Record<string, any>): Promise<FlowRuleListResponse> => {
  return request.get<FlowRuleListResponse>('/flow-rules/', {
    params
  })
}

export const getFlowRuleDetail = (params?: GetFlowRuleDetailParams): Promise<Result<FlowRule>> => {
  if (!params?.id) {
    throw new Error('规则ID不能为空')
  }
  return request.get<Result<FlowRule>>(`/flow-rules/${params.id}/`)
}

export const createFlowRule = (params?: CreateFlowRuleParams): Promise<Result<FlowRule>> => {
  if (!params) {
    throw new Error('创建参数不能为空')
  }
  return request.post<Result<FlowRule>>('/flow-rules/', params)
}

export const updateFlowRule = (params?: UpdateFlowRuleParams): Promise<Result<FlowRule>> => {
  if (!params?.id) {
    throw new Error('更新规则ID不能为空')
  }
  return request.put<Result<FlowRule>>(`/flow-rules/${params.id}/`, params)
}

export const deleteFlowRule = (params?: DeleteFlowRuleParams): Promise<Result<void>> => {
  if (!params?.id) {
    throw new Error('删除规则ID不能为空')
  }
  return request.delete<Result<void>>(`/flow-rules/${params.id}/`)
}
