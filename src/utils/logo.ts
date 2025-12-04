/*
 * @Author: liaokt
 * @Description: Logo 工具函数
 * @Date: 2025-12-01
 */

/**
 * 动态设置 Favicon
 * @param url - Favicon URL
 */
export function setFavicon(url: string): void {
  // 查找现有的 favicon link 标签
  let faviconLink = document.querySelector("link[rel~='icon']") as HTMLLinkElement

  if (!faviconLink) {
    // 如果不存在，创建新的 link 标签
    faviconLink = document.createElement('link')
    faviconLink.rel = 'icon'
    document.head.appendChild(faviconLink)
  }

  // 更新 href
  faviconLink.href = url

  // 同时设置 apple-touch-icon（iOS Safari）
  let appleTouchIcon = document.querySelector("link[rel~='apple-touch-icon']") as HTMLLinkElement
  if (!appleTouchIcon) {
    appleTouchIcon = document.createElement('link')
    appleTouchIcon.rel = 'apple-touch-icon'
    document.head.appendChild(appleTouchIcon)
  }
  appleTouchIcon.href = url
}

/**
 * 动态设置页面标题
 * @param title - 页面标题
 */
export function setPageTitle(title: string): void {
  document.title = title
}

/**
 * 获取完整的图片 URL
 * 如果是相对路径，会根据当前环境自动处理
 * @param url - 图片 URL（可以是相对路径或绝对路径）
 * @returns 完整的图片 URL
 */
export function getImageUrl(url: string): string {
  // 如果是绝对路径（http:// 或 https://），直接返回
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }

  // 处理 Vite 别名路径 @/ 或 ~/，转换为 /src/ 路径
  if (url.startsWith('@/') || url.startsWith('~/')) {
    // 将 @/ 或 ~/ 替换为 /src/，Vite 会正确处理 /src/ 开头的路径
    return url.replace(/^@\//, '/src/').replace(/^~\//, '/src/')
  }

  // 如果是后端 API 返回的路径（以 / 开头），可能需要拼接 API base URL
  if (url.startsWith('/') && !url.startsWith('/src/')) {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || ''
    // 如果后端返回的是完整 URL，直接返回
    if (url.startsWith('/api/') || url.startsWith('/static/')) {
      return apiBaseUrl ? `${apiBaseUrl}${url}` : url
    }
  }

  // 其他情况直接返回（Vite 会自动处理）
  return url
}
