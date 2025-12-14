/*
 * @Author: liaokt
 * @Description: 本地存储工具函数
 * @Date: 2025-12-10
 */

/**
 * 获取本地存储数据
 * @param key 键名
 * @param defaultValue 默认值
 */
export function getStorage<T = any>(key: string, defaultValue?: T): T | undefined {
  try {
    const item = localStorage.getItem(key)
    if (item === null) return defaultValue
    return JSON.parse(item)
  } catch {
    return defaultValue
  }
}

/**
 * 设置本地存储数据
 * @param key 键名
 * @param value 数据值
 */
export function setStorage<T = any>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error('存储数据失败:', error)
  }
}

/**
 * 移除本地存储数据
 * @param key 键名
 */
export function removeStorage(key: string): void {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error('删除数据失败:', error)
  }
}

/**
 * 清空所有本地存储数据
 */
export function clearStorage(): void {
  try {
    localStorage.clear()
  } catch (error) {
    console.error('清空存储失败:', error)
  }
}

/**
 * 检查本地存储中是否存在某个键
 * @param key 键名
 */
export function hasStorage(key: string): boolean {
  return localStorage.getItem(key) !== null
}

/**
 * 获取会话存储数据
 * @param key 键名
 * @param defaultValue 默认值
 */
export function getSession<T = any>(key: string, defaultValue?: T): T | undefined {
  try {
    const item = sessionStorage.getItem(key)
    if (item === null) return defaultValue
    return JSON.parse(item)
  } catch {
    return defaultValue
  }
}

/**
 * 设置会话存储数据
 * @param key 键名
 * @param value 数据值
 */
export function setSession<T = any>(key: string, value: T): void {
  try {
    sessionStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error('存储数据失败:', error)
  }
}

/**
 * 移除会话存储数据
 * @param key 键名
 */
export function removeSession(key: string): void {
  try {
    sessionStorage.removeItem(key)
  } catch (error) {
    console.error('删除数据失败:', error)
  }
}

/**
 * 清空所有会话存储数据
 */
export function clearSession(): void {
  try {
    sessionStorage.clear()
  } catch (error) {
    console.error('清空存储失败:', error)
  }
}

/**
 * 检查会话存储中是否存在某个键
 * @param key 键名
 */
export function hasSession(key: string): boolean {
  return sessionStorage.getItem(key) !== null
}
