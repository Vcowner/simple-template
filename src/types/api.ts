/*
 * @Author: liaokt
 * @Description: API 相关类型定义
 * @Date: 2025-11-06 09:44:01
 * @LastEditors: liaokt
 * @LastEditTime: 2025-12-10 09:12:22
 */

// API 响应基础类型（Result 是 ApiResponse 的别名，保持向后兼容）
export interface Result<T = any> {
  code: number
  message?: string
  msg?: string
  data: T
  success?: boolean
}

// ApiResponse 作为 Result 的别名，保持向后兼容
export type ApiResponse<T = any> = Result<T>

// 分页请求参数
export interface PaginationParams {
  page: number
  pageSize: number
  [key: string]: any
}

// 分页响应数据
export interface PaginationData<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

// 分页响应类型
export interface PaginationResponse<T> extends Result<PaginationData<T>> {}

// 列表响应类型
export interface ListResponse<T> extends Result<T[]> {}

// 响应处理结果接口
export interface ResponseResult<T = any> {
  success: boolean
  data: T | null
  message: string
  code: number
}

// 请求配置扩展
export interface RequestConfig {
  hiddenError?: boolean // 隐藏错误提示
  showLoading?: boolean // 显示加载状态
}
