/*
 * @Author: liaokt
 * @Description:
 * @Date: 2025-12-01 16:40:53
 * @LastEditors: liaokt
 * @LastEditTime: 2025-12-01 16:43:58
 */
import { message } from 'ant-design-vue'

/**
 * 下载工具函数
 */

/**
 * 下载模板文件
 * @param url - 下载地址
 * @param filename - 文件名（可选）
 * @returns 是否成功
 */
export function downloadTemplate(url: string, filename?: string): boolean {
  if (!url) {
    message.error('下载模板地址无效')
    return false
  }

  try {
    const link = document.createElement('a')
    link.href = url
    link.download = filename || 'template'
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    return true
  } catch (error) {
    message.error('下载模板失败，请稍后重试')
    console.error('Download template error:', error)
    return false
  }
}

/**
 * 下载文件（通过 URL）
 * @param url - 文件 URL
 * @param filename - 文件名（可选）
 */
export function downloadFile(url: string, filename?: string): void {
  if (!url) {
    message.error('下载地址无效')
    return
  }

  try {
    const link = document.createElement('a')
    link.href = url
    if (filename) {
      link.download = filename
    }
    link.target = '_blank'
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    message.error('下载文件失败，请稍后重试')
    console.error('Download file error:', error)
  }
}
