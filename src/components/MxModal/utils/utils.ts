/*
 * @Author: liaokt
 * @Description: MxModal 工具函数
 * @Date: 2025-12-02 09:30:00
 * @LastEditors: liaokt
 * @LastEditTime: 2025-12-02 09:31:34
 */

/**
 * 根据基础标题和模式生成最终标题
 * @param title - 基础标题，如 '流级特征'
 * @param mode - 模式，如 'add' | 'edit' | 'detail'
 * @returns 生成的标题
 */
export function generateModalTitle(title: string, mode?: 'add' | 'edit' | 'detail'): string {
  if (!title) {
    return '提示'
  }

  // 根据 mode 生成标题
  if (mode === 'add') {
    return `新增${title}`
  }
  if (mode === 'edit') {
    return `编辑${title}`
  }
  if (mode === 'detail') {
    return `${title}详情`
  }

  // 默认返回原标题（无 mode 时）
  return title
}
