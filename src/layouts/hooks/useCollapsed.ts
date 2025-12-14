import { useAppStore } from '@/store/modules/app'

/**
 * 侧边栏折叠状态管理
 * 使用 app store 统一管理每个布局的折叠状态
 */
export function useCollapsed() {
  const appStore = useAppStore()

  // 获取当前布局的折叠状态（已经是 computed）
  const getCollapsed = appStore.getSiderCollapsed

  // 切换当前布局的折叠状态
  const toggleCollapsed = () => {
    appStore.toggleSiderCollapsed()
  }

  return {
    getCollapsed,
    toggleCollapsed
  }
}
