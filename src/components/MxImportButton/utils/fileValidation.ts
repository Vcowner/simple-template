/*
 * @Author: liaokt
 * @Description:
 * @Date: 2025-12-01 16:40:41
 * @LastEditors: liaokt
 * @LastEditTime: 2025-12-01 16:43:36
 */
/**
 * 文件验证工具函数
 */

/**
 * 验证文件类型是否匹配 accept
 * @param file - 文件对象
 * @param accept - 接受的文件类型字符串，如 ".xlsx,.xls" 或 "image/*"
 * @returns 是否匹配
 */
export function validateFileType(file: File, accept?: string): boolean {
  if (!accept) return true

  const fileName = file.name?.toLowerCase() || ''
  const fileType = file.type?.toLowerCase() || ''
  const acceptTypes = accept.split(',').map(type => type.trim().toLowerCase())

  return acceptTypes.some(acceptType => {
    // 扩展名匹配（如 .xlsx, .xls）
    if (acceptType.startsWith('.')) {
      return fileName.endsWith(acceptType)
    }
    // 通配符匹配（如 image/*）
    if (acceptType.includes('*')) {
      const baseType = acceptType.split('/')[0]
      return fileType.startsWith(baseType + '/')
    }
    // 精确 MIME 类型匹配
    return fileType === acceptType
  })
}

/**
 * 验证文件大小
 * @param file - 文件对象
 * @param maxSizeMB - 最大文件大小（单位：MB）
 * @returns 是否通过验证
 */
export function validateFileSize(file: File, maxSizeMB?: number): boolean {
  if (!maxSizeMB) return true
  const fileSizeMB = file.size / 1024 / 1024
  return fileSizeMB <= maxSizeMB
}

/**
 * 格式化 accept 文本用于提示
 * @param accept - accept 字符串
 * @returns 格式化后的文本
 */
export function formatAcceptText(accept: string): string {
  if (accept.includes('*')) {
    return accept
  }
  return accept
    .split(',')
    .map(t => t.trim())
    .join('、')
}

/**
 * 获取文件大小文本（格式化显示）
 * @param bytes - 文件大小（字节）
 * @returns 格式化后的文本，如 "1.5 MB"
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}
