/*
 * @Author: liaokt
 * @Description:
 * @Date: 2025-11-06 09:14:28
 * @LastEditors: liaokt
 * @LastEditTime: 2025-11-06 09:16:07
 */
import axios from 'axios'
import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { message } from 'ant-design-vue'
import type { Result } from '@/types/api'
import { API_CODE } from '@/constants/api'

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
  baseURL: `${import.meta.env.VITE_BASE_URL ?? ''}`,
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
    // 获取 token
    const token = localStorage.getItem('token')
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
      localStorage.setItem('captcha-key', response.headers.key as string)
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
      // 处理业务错误
      if (!response.config.hiddenError) {
        showError(message || msg || '请求失败')
      }
      return Promise.reject(response.data)
    }
  },
  (error: AxiosError) => {
    // 处理 HTTP 网络错误
    let message = ''

    // HTTP 状态码
    const status = error.response?.status

    switch (status) {
      case 401: {
        message = '登录失效，请重新登录'
        // 清除 token
        localStorage.removeItem('token')
        // 如果需要跳转到登录页，可以在这里添加
        // router.push('/login')
        break
      }
      case 403: {
        message = '无访问权限'
        break
      }
      case 404: {
        message = '请求地址不存在'
        break
      }
      case 500: {
        message = '网络请求失败'
        break
      }
      default: {
        message = '网络请求失败'
      }
    }

    // 显示错误消息（404 或非隐藏错误时）
    if (!error?.config?.hiddenError && status !== 404) {
      showError(message)
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
