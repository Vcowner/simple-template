/**
 * @Author: liaokt
 * @Description: 树组件类型定义
 * @Date: 2025-12-15
 */

export interface TreeNode {
  title: string
  key: string | number
  children?: TreeNode[]
  [key: string]: any // 允许节点有额外的属性
}

/**
 * 菜单项配置
 */
export type TreeNodeMenuItem =
  | {
      /** 菜单项唯一标识 */
      key: string
      /** 菜单项标签 */
      label: string
      /** 菜单项图标 */
      icon?: any
      /** 是否为危险操作（显示为红色） */
      danger?: boolean
      /** 是否显示该菜单项（根据节点数据判断） */
      visible?: (nodeData: TreeNode) => boolean
      /** 点击事件处理函数 */
      onClick?: (nodeData: TreeNode) => void
      type?: never
    }
  | {
      /** 类型：divider 表示分割线 */
      type: 'divider'
    }
