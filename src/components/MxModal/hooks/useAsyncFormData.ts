/*
 * @Author: liaokt
 * @Description: useAsyncFormData - 简化异步表单数据加载的 Hook
 * @Date: 2025-12-02 09:30:00
 * @LastEditors: liaokt
 * @LastEditTime: 2025-12-02 14:42:51
 */
import { ref, watch, toRaw, readonly } from 'vue'
import type { UseModalReturn } from './useModal'

interface UseAsyncFormDataOptions<T = any> {
  /** Modal 实例 */
  modal: UseModalReturn
  /** 是否在弹窗可见时自动加载 */
  autoLoad?: boolean
  /** 数据加载函数 */
  loadData?: (args: Record<string, any>) => Promise<T>
  /** 数据格式化函数（将接口数据转换为表单数据） */
  formatData?: (data: T) => Record<string, any>
  /** 数据更新回调 */
  onDataUpdate?: (data: Record<string, any>) => void
}

/**
 * useAsyncFormData - 简化异步表单数据加载
 *
 * 这个 Hook 封装了常见的"编辑模式异步加载详情"的场景，
 * 减少了在组件中手动 watch visible 和 nextTick 的样板代码。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { useAsyncFormData } from '@/components/MxModal'
 * import { useModalInstance, type UseModalReturn } from '@/components/MxModal'
 * import { getFlowFeatureDetail } from '@/api/flow-features'
 *
 * interface Props {
 *   modal?: UseModalReturn
 * }
 *
 * const props = defineProps<Props>()
 * const modal = useModalInstance(props)
 *
 * // 使用 useAsyncFormData 简化异步数据加载
 * const { loading, data } = useAsyncFormData({
 *   modal,
 *   loadData: async (args) => {
 *     if (args.id) {
 *       const response = await getFlowFeatureDetail({ id: args.id })
 *       return response.data
 *     }
 *     return null
 *   },
 *   formatData: (apiData) => {
 *     // 将接口数据转换为表单数据
 *     return {
 *       ...apiData,
 *       tcp_flags: apiData.tcp_flags_list || []
 *     }
 *   },
 *   onDataUpdate: (formData) => {
 *     // 数据加载完成后，更新到 modal.args
 *     modal.update({ data: formData })
 *   }
 * })
 * </script>
 * ```
 */
export function useAsyncFormData<T = any>(options: UseAsyncFormDataOptions<T>) {
  const { modal, autoLoad = true, loadData, formatData, onDataUpdate } = options

  const loading = ref(false)
  const data = ref<Record<string, any> | null>(null)
  const error = ref<Error | null>(null)

  // 判断是否为编辑模式
  const isEditMode = (args: Record<string, any>): boolean => {
    return !!(args.id || args.type === 'edit')
  }

  // 加载数据
  const load = async () => {
    if (!loadData) return

    const args = toRaw(modal.args.value)

    // 只在编辑模式下加载
    if (!isEditMode(args)) {
      data.value = null
      return
    }

    loading.value = true
    error.value = null

    try {
      const apiData = await loadData(args)

      if (apiData) {
        // 格式化数据
        const formattedData = formatData ? formatData(apiData) : (apiData as any)
        data.value = formattedData

        // 触发更新回调
        if (onDataUpdate) {
          onDataUpdate(formattedData)
        } else {
          // 默认行为：更新到 modal.args.data
          modal.update({ data: formattedData })
        }
      }
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err))
      console.error('加载数据失败:', err)
    } finally {
      loading.value = false
    }
  }

  // 监听弹窗打开
  if (autoLoad) {
    watch(
      () => modal.visible.value,
      (visible, prevVisible) => {
        // 只在从关闭变为打开时加载
        if (visible && !prevVisible) {
          load()
        }
      },
      { immediate: false }
    )
  }

  return {
    /** 加载状态 */
    loading: readonly(loading),
    /** 加载的数据 */
    data: readonly(data),
    /** 错误信息 */
    error: readonly(error),
    /** 手动触发加载 */
    load,
    /** 清除数据 */
    clear: () => {
      data.value = null
      error.value = null
    }
  }
}
