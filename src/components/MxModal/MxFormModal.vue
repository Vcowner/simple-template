<!--
 * @Author: liaokt
 * @Description: 封装的表单 Modal 组件，基于 MxModal 系统
 * @Date: 2025-11-13 12:00:00
 * @LastEditors: liaokt
 * @LastEditTime: 2025-11-27 09:40:40
-->
<template>
  <MxModal
    :modal="modal"
    :body-loading="bodyLoading"
    :confirm-loading="confirmLoadingValue"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      :layout="layout"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      :validate-trigger="[]"
    >
      <slot :form-data="formData" />
    </a-form>
  </MxModal>
</template>

<script setup lang="ts">
import { reactive, ref, watch, nextTick, toRaw, computed } from 'vue'
import { useModal, type UseModalReturn } from './useModal'
import MxModal from './MxModal.vue'
import type { FormInstance, Rule } from 'ant-design-vue/es/form'

defineOptions({
  name: 'MxFormModal'
})

interface Props {
  /** Modal 实例（从 modalRegistry 传递） */
  modal?: UseModalReturn
  /** 表单验证规则 */
  rules?: Record<string, Rule[]>
  /** 表单布局 */
  layout?: 'horizontal' | 'vertical' | 'inline'
  /** label 宽度 */
  labelCol?: { span: number; offset?: number }
  /** 输入框宽度 */
  wrapperCol?: { span: number; offset?: number }
  /** 是否在关闭时重置表单 */
  resetOnClose?: boolean
  /** 内容加载状态 */
  bodyLoading?: boolean
  /** 确认按钮加载状态 */
  confirmLoading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modal: undefined,
  rules: () => ({}),
  layout: 'vertical',
  labelCol: undefined,
  wrapperCol: undefined,
  resetOnClose: true,
  bodyLoading: false,
  confirmLoading: false
})

const bodyLoading = computed(() => props.bodyLoading)
const confirmLoadingValue = computed(() => props.confirmLoading)
const emit = defineEmits<{
  ok: [values: Record<string, any>]
  cancel: []
}>()

// 如果传递了 modal prop，使用它；否则创建新的实例
const modal = props.modal || useModal()
const formRef = ref<FormInstance>()

// 获取业务数据作为表单初始值
const formData = reactive<Record<string, any>>({})

// 防止重复更新的标志位
let isUpdating = false
let lastDataHash = ''
let isInitialized = false

// 生成数据的简单哈希，用于判断数据是否真的变化了
const getDataHash = (data: any): string => {
  if (!data || typeof data !== 'object') return ''
  try {
    return JSON.stringify(data)
  } catch {
    return String(data)
  }
}

// 更新表单数据（优化版本，减少响应式更新）
const updateFormData = (source: Record<string, any>) => {
  if (isUpdating) return

  const sourceData = toRaw(source) || {}
  const dataHash = getDataHash(sourceData)

  // 如果数据哈希相同，说明数据没有变化，不需要更新
  if (dataHash === lastDataHash && isInitialized) return

  isUpdating = true
  lastDataHash = dataHash
  isInitialized = true

  try {
    // 清除验证状态
    formRef.value?.clearValidate()

    // 使用 Object.assign 一次性更新，减少响应式触发次数
    Object.keys(formData).forEach(key => {
      if (!(key in sourceData)) {
        delete formData[key]
      }
    })
    Object.assign(formData, sourceData)
  } finally {
    isUpdating = false
  }
}

// 重置表单数据
const resetFormData = () => {
  if (isUpdating) return

  isUpdating = true
  lastDataHash = ''
  isInitialized = false

  try {
    Object.keys(formData).forEach(key => {
      delete formData[key]
    })
    formRef.value?.resetFields()
    formRef.value?.clearValidate()
  } finally {
    isUpdating = false
  }
}

// 获取表单数据源
const getFormDataSource = (): Record<string, any> => {
  const args = toRaw(modal.args.value)
  if (args?.data && typeof args.data === 'object') {
    return toRaw(args.data) as Record<string, any>
  }
  return toRaw(modal.getFormData() || {})
}

// 分离 watch：先监听 visible，再单独监听 data（避免循环）
watch(
  () => modal.visible.value,
  (visible, prevVisible) => {
    // 弹窗关闭时：重置表单
    if (!visible && prevVisible && props.resetOnClose) {
      nextTick(() => {
        resetFormData()
      })
      return
    }

    // 弹窗打开时：初始化表单数据
    if (visible && !prevVisible) {
      isInitialized = false // 重置初始化标志
      nextTick(() => {
        const sourceData = getFormDataSource()
        updateFormData(sourceData)
      })
    }
  },
  { immediate: false }
)

// 单独监听 data 变化（仅在弹窗可见时生效，用于异步加载数据）
watch(
  () => modal.args.value.data,
  (data, prevData) => {
    // 只在弹窗可见时处理数据变化
    if (!modal.visible.value) return

    // 如果数据引用相同，说明没有变化
    if (data === prevData) return

    // 如果数据不存在或不是对象，跳过
    if (!data || typeof data !== 'object') return

    const dataHash = getDataHash(data)
    // 只有当数据哈希不同时才更新（避免重复更新）
    if (dataHash !== lastDataHash) {
      nextTick(() => {
        updateFormData(toRaw(data))
      })
    }
  },
  { immediate: false, deep: false } // 不使用 deep，只监听引用变化
)

// 处理确认
const handleOk = async () => {
  if (!formRef.value) {
    modal.hide()
    return
  }

  try {
    // 验证表单
    await formRef.value.validate()

    // 触发 ok 事件，传递表单数据
    emit('ok', { ...formData })
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

// 处理取消
const handleCancel = () => {
  emit('cancel')
  modal.hide()
}

// 暴露表单实例和方法
defineExpose({
  formRef,
  formData,
  validate: () => formRef.value?.validate(),
  resetFields: () => formRef.value?.resetFields(),
  clearValidate: () => formRef.value?.clearValidate(),
  getFieldsValue: () => formRef.value?.getFieldsValue()
})
</script>
