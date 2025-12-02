<!--
 * @Author: liaokt
 * @Description: 封装的 a-modal 组件，基于 MxModal 系统
 * @Date: 2025-11-13 12:00:00
 * @LastEditors: liaokt
 * @LastEditTime: 2025-12-01 15:41:07
-->
<template>
  <a-modal
    :open="modal.visible.value"
    v-bind="modalProps"
    :body-style="{ paddingTop: '10px' }"
    @cancel="handleCancel"
    @ok="handleOk"
    @after-close="modal.remove()"
  >
    <a-spin :spinning="contentLoading">
      <slot />
    </a-spin>
    <template v-if="slots.footer" #footer>
      <slot name="footer" />
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { useModalInstance } from './hooks/useModalProps'
import { type UseModalReturn } from './hooks/useModal'
import type { ModalProps } from 'ant-design-vue'

defineOptions({
  name: 'MxModal'
})

interface Props {
  /** Modal 实例（从 modalRegistry 传递） */
  modal?: UseModalReturn
  /** 是否显示确认按钮 */
  showOk?: boolean
  /** 是否显示取消按钮 */
  showCancel?: boolean
  /** 自定义确认按钮文字 */
  okText?: string
  /** 自定义取消按钮文字 */
  cancelText?: string
  /** 确认按钮加载状态 */
  confirmLoading?: boolean
  /** 内容区域加载状态（可由外部控制） */
  bodyLoading?: boolean
  /** 是否在确认后自动关闭（默认 true，设为 false 时由外部控制关闭时机） */
  autoHideOnOk?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modal: undefined,
  showOk: true,
  showCancel: true,
  okText: '确定',
  cancelText: '取消',
  bodyLoading: false,
  autoHideOnOk: true
})

const emit = defineEmits<{
  ok: []
  cancel: []
}>()

// 使用 useModalInstance 简化代码
const modal = useModalInstance(props)
const slots = useSlots()

// 合并计算 modalProps，减少不必要的计算
const modalProps = computed<ModalProps>(() => {
  // 获取 a-modal 的参数（自动提取）
  const modalPropsFromArgs = modal.getModalProps() as ModalProps & { bodyLoading?: boolean }
  const {
    footer: footerFromArgs,
    bodyLoading: bodyLoadingFromArgs,
    ...restProps
  } = modalPropsFromArgs

  // 判断是否有 footer slot
  const hasFooterSlot = Boolean(slots.footer)

  // 确定 footer 的值
  let footer: ModalProps['footer']
  if (footerFromArgs !== undefined) {
    footer = footerFromArgs
  } else if (hasFooterSlot) {
    footer = undefined
  } else if (props.showOk || props.showCancel) {
    footer = undefined
  } else {
    footer = null
  }

  return {
    title: restProps.title || '提示',
    width: 520,
    okText: props.okText,
    cancelText: props.cancelText,
    confirmLoading: props.confirmLoading,
    ...restProps, // 从 args 中获取的参数会覆盖默认值
    footer
  }
})

// 内容加载状态
const contentLoading = computed(
  () =>
    (modal.getModalProps() as { bodyLoading?: boolean }).bodyLoading ?? props.bodyLoading ?? false
)

// 处理确认
const handleOk = () => {
  emit('ok')
  // 根据 autoHideOnOk 决定是否自动关闭
  if (props.autoHideOnOk) {
    modal.hide()
  }
}

// 处理取消
const handleCancel = () => {
  emit('cancel')
  // 取消时总是关闭
  modal.hide()
}
</script>
