import { message } from 'ant-design-vue'
import { formatAcceptText } from './fileValidation'

/**
 * 错误处理工具函数
 */

/**
 * 上传错误类型
 */
export enum UploadErrorType {
  FILE_TYPE = 'FILE_TYPE',
  FILE_SIZE = 'FILE_SIZE',
  UPLOAD_FAILED = 'UPLOAD_FAILED',
  NETWORK_ERROR = 'NETWORK_ERROR',
  UNKNOWN = 'UNKNOWN'
}

/**
 * 上传错误类
 */
export class UploadError extends Error {
  constructor(
    public type: UploadErrorType,
    message: string,
    public originalError?: Error
  ) {
    super(message)
    this.name = 'UploadError'
  }
}

/**
 * 处理文件类型错误
 * @param accept - 接受的文件类型
 */
export function handleFileTypeError(accept: string): void {
  const acceptText = formatAcceptText(accept)
  message.error(`文件类型不匹配，仅支持 ${acceptText} 格式的文件`)
}

/**
 * 处理文件大小错误
 * @param maxSizeMB - 最大文件大小（MB）
 */
export function handleFileSizeError(maxSizeMB: number): void {
  message.error(`文件大小不能超过 ${maxSizeMB}MB`)
}

/**
 * 处理上传失败错误
 * @param errorMessage - 错误信息
 */
export function handleUploadError(errorMessage?: string): void {
  message.error(errorMessage || '上传失败，请稍后重试')
}

/**
 * 处理网络错误
 */
export function handleNetworkError(): void {
  message.error('网络错误，请检查网络连接')
}

/**
 * 统一错误处理
 * @param error - 错误对象
 */
export function handleError(error: Error | UploadError): void {
  if (error instanceof UploadError) {
    switch (error.type) {
      case UploadErrorType.FILE_TYPE:
        handleFileTypeError('')
        break
      case UploadErrorType.FILE_SIZE:
        handleFileSizeError(0)
        break
      case UploadErrorType.UPLOAD_FAILED:
        handleUploadError(error.message)
        break
      case UploadErrorType.NETWORK_ERROR:
        handleNetworkError()
        break
      default:
        handleUploadError(error.message)
    }
  } else {
    handleUploadError(error.message)
  }
}
