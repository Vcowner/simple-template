/*
 * @Author: liaokt
 * @Description: useModalInstance - 简化 Modal 组件的 modal 实例获取
 * @Date: 2025-12-01 16:00:00
 * @LastEditors: liaokt
 * @LastEditTime: 2025-12-02 09:13:11
 */
import { useModal, type UseModalReturn } from './useModal'

/**
 * useModalInstance - 简化 Modal 组件的 modal 实例获取
 *
 * 这个 composable 会自动处理 `props.modal || useModal()` 的逻辑，
 * 减少每个 Modal 组件中的样板代码。
 *
 * @example
 * ```vue
 * <template>
 *   <MxFormModal :modal="modal" @ok="handleSubmit">
 *     <!-- ... -->
 *   </MxFormModal>
 * </template>
 *
 * <script setup lang="ts">
 * import { useModalInstance } from '@/components/MxModal'
 * import { MxFormModal, type UseModalReturn } from '@/components/MxModal'
 *
 * interface Props {
 *   modal?: UseModalReturn
 * }
 *
 * const props = defineProps<Props>()
 * // 使用 useModalInstance 简化代码（替代 props.modal || useModal()）
 * const modal = useModalInstance(props)
 *
 * const handleSubmit = (values: Record<string, any>) => {
 *   modal.resolve(values)
 *   modal.hide()
 * }
 * </script>
 * ```
 *
 * **对比原来的写法**：
 * ```ts
 * // 原来需要写：
 * const modal = props.modal || useModal()
 *
 * // 现在只需要：
 * const modal = useModalInstance(props)
 * ```
 *
 * 虽然代码量减少不多，但语义更清晰，且统一了获取 modal 实例的方式。
 */
export function useModalInstance<T extends { modal?: UseModalReturn }>(props: T): UseModalReturn {
  return props.modal || useModal()
}
