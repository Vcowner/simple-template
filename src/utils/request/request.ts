/*
 * @Author: liaokt
 * @Description:
 * @Date: 2025-11-06 09:14:28
 * @LastEditors: liaokt
 * @LastEditTime: 2025-12-16 10:19:23
 */
import axios from 'axios'
import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { message } from 'ant-design-vue'
import type { Result } from '@/types/modules/api'
import { API_CODE } from '@/constants/api'
import { ROUTE_NAME } from '@/constants'
import { getStorage, setStorage, removeStorage } from '@/utils/storage'
import router from '@/router'

/**
 * 扩展 AxiosRequestConfig 类型
 */
declare module 'axios' {
  export interface AxiosRequestConfig {
    hiddenError?: boolean // 隐藏错误提示
  }
}

/**
 * 错误消息防抖处理
 */
let errorMessageTimer: ReturnType<typeof setTimeout> | null = null
const showError = (errorMsg: string): void => {
  if (errorMessageTimer) {
    clearTimeout(errorMessageTimer)
  }
  errorMessageTimer = setTimeout(() => {
    message.error(errorMsg)
  }, 1000)
}

/**
 * 创建 axios 实例
 */
const service: AxiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL ?? ''}`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
})

/**
 * 请求拦截器
 */
service.interceptors.request.use(
  config => {
    // 获取 token（从单独的 token 存储中获取）
    const token = getStorage<string>('token')
    if (token) {
      ;(config.headers as any).Authorization = config.headers?.Authorization ?? `JWT ${token}`
    }

    // 添加时间戳
    ;(config.headers as any)['X-Timestamp'] = Math.floor(new Date().getTime() / 1000)

    // 添加 CSRF token 处理
    const csrfToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('csrftoken='))
      ?.split('=')[1]
    if (csrfToken) {
      ;(config.headers as any)['X-CSRFToken'] = csrfToken
    }

    return config
  },
  (error: AxiosError) => {
    console.error('请求错误:', error.message)
    return Promise.reject(error)
  }
)

/**
 * 响应拦截器
 */
service.interceptors.response.use(
  (response: AxiosResponse) => {
    // 判断是否是文件流，文件流直接返回
    if ('key' in response.headers) {
      setStorage('captcha-key', response.headers.key as string)
    }
    if (response.config.responseType === 'blob') {
      return response
    }

    const { code, message, msg } = response.data as Result

    // 根据自定义错误码判断请求是否成功
    // 10200 表示成功
    if (code === API_CODE.SUCCESS) {
      // 将组件用的数据返回
      return response.data
    } else {
      // 处理业务错误（HTTP 200 但业务 code 不是 10200）
      // 注意：这里已经处理了错误提示，后续 catch 中不应再次显示
      if (!response.config.hiddenError) {
        showError(message || msg || '请求失败')
      }
      return Promise.reject(response.data)
    }
  },
  (error: AxiosError) => {
    // 处理 HTTP 网络错误（HTTP 状态码不是 200-299 的情况）
    // 注意：业务错误（HTTP 200 但 code !== 10200）已在成功回调中处理，不会进入这里

    // HTTP 状态码
    const status = error.response?.status
    const errorData = error.response?.data as Result | undefined

    // 优先使用响应体中的错误消息（如果后端返回了业务错误格式）
    let errorMessage: string | undefined
    if (errorData && typeof errorData === 'object') {
      errorMessage = (errorData as Result).message || (errorData as Result).msg
    }

    switch (status) {
      case 401: {
        // 清除 token 和用户信息
        removeStorage('token')
        removeStorage('userInfo')
        // 显示错误消息（优先使用响应体中的 message，如登录失败提示）
        const errorMsg = errorMessage || '登录已失效，请重新登录'
        if (!error?.config?.hiddenError) {
          showError(errorMsg)
        }
        // 跳转到登录页
        router.push({ name: ROUTE_NAME.LOGIN })
        return Promise.reject(error)
      }
      case 403: {
        errorMessage = errorMessage || '无访问权限'
        break
      }
      case 404: {
        errorMessage = errorMessage || '请求地址不存在'
        // 404 通常不需要显示错误消息
        break
      }
      case 500: {
        errorMessage = errorMessage || '服务器内部错误'
        break
      }
      default: {
        errorMessage = errorMessage || '网络请求失败'
      }
    }

    // 显示错误消息（排除 401 和 404）
    if (!error?.config?.hiddenError && status !== 401 && status !== 404) {
      showError(errorMessage || '网络请求失败')
    }

    return Promise.reject(error)
  }
)

/**
 * 导出封装的请求方法
 */
export const request = {
  /**
   * GET 请求
   */
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return service.get(url, config)
  },

  /**
   * POST 请求
   */
  post<T = any>(url: string, data?: object, config?: AxiosRequestConfig): Promise<T> {
    return service.post(url, data, config)
  },

  /**
   * PUT 请求
   */
  put<T = any>(url: string, data?: object, config?: AxiosRequestConfig): Promise<T> {
    return service.put(url, data, config)
  },

  /**
   * PATCH 请求
   */
  patch<T = any>(url: string, data?: object, config?: AxiosRequestConfig): Promise<T> {
    return service.patch(url, data, config)
  },

  /**
   * DELETE 请求
   */
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return service.delete(url, config)
  }
}

export const axiosInstance = service

export default service
