/*
 * @Author: liaokt
 * @Description:
 * @Date: 2025-12-01 16:40:46
 * @LastEditors: liaokt
 * @LastEditTime: 2025-12-01 16:43:47
 */
import type { UploadFile } from 'ant-design-vue'

/**
 * 文件 URL 工具函数
 */

/**
 * 从文件对象中获取 URL
 * 按优先级检查多个可能的 URL 来源
 * @param file - 上传文件对象
 * @returns URL 字符串，如果不存在则返回 undefined
 */
export function getFileUrl(file: UploadFile | any): string | undefined {
  return (
    file?.url ||
    file?.thumbUrl ||
    file?.response?.url ||
    file?.response?.thumbUrl ||
    file?.response?.data?.url
  )
}

/**
 * 确保文件对象包含 URL
 * 如果文件没有 url，尝试从 response 中提取
 * @param file - 上传文件对象
 * @returns 是否成功设置了 URL
 */
export function ensureFileUrl(file: UploadFile): boolean {
  if (file.url) {
    return true
  }

  const url = getFileUrl(file)
  if (url) {
    file.url = url
    if (!file.thumbUrl) {
      file.thumbUrl = url
    }
    return true
  }

  return false
}
