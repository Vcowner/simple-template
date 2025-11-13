<!--
 * @Author: liaokt
 * @Description: 新增 / 编辑数据流测量规则弹窗
 * @Date: 2025-11-13 19:20:00
 * @LastEditors: liaokt
 * @LastEditTime: 2025-11-13 19:20:00
-->
<template>
  <MxFormModal :modal="modal" :rules="rules" layout="vertical" @ok="handleSubmit">
    <template #default="{ formData }">
      <MxFormRow :cols="1">
        <a-form-item label="规则名称" name="ruleName" required>
          <a-input v-model:value="formData.ruleName" placeholder="请输入规则名称" />
        </a-form-item>

        <a-form-item label="测量维度" name="metricDimension" required>
          <a-select
            v-model:value="formData.metricDimension"
            :options="dimensionOptions"
            placeholder="请选择测量维度"
          />
        </a-form-item>

        <a-form-item label="阈值范围" name="thresholdRange" required>
          <a-input
            v-model:value="formData.thresholdRange"
            placeholder="请输入阈值范围，例如 5-100 KB"
          />
        </a-form-item>
      </MxFormRow>
    </template>
  </MxFormModal>
</template>

<script setup lang="ts">
import { toRaw } from 'vue'
import { MxFormModal, useModal } from '@/components/MxModal'
import type { UseModalReturn } from '@/components/MxModal/useModal'
import { MxFormRow } from '@/components/MxFormLayout'
import type { Rule } from 'ant-design-vue/es/form'

defineOptions({
  name: 'AddFlowRuleModal'
})

interface Props {
  /** Modal 实例（从 modalRegistry 传递） */
  modal?: UseModalReturn
}

const props = defineProps<Props>()

// 获取 modal 实例
const modal = props.modal || useModal()

const dimensionOptions = [
  { label: '数据流长度', value: '数据流长度' },
  { label: '持续时间', value: '持续时间' },
  { label: 'TCP标记', value: 'TCP标记' },
  { label: 'IP协议', value: 'IP协议' }
]

// 表单验证规则
const rules: Record<string, Rule[]> = {
  ruleName: [{ required: true, message: '请输入规则名称', trigger: 'blur' }],
  metricDimension: [{ required: true, message: '请选择测量维度', trigger: 'change' }],
  thresholdRange: [{ required: true, message: '请输入阈值范围', trigger: 'blur' }]
}

// 处理提交
const handleSubmit = async (values: Record<string, any>) => {
  const args = toRaw(modal.args.value)
  const isEdit = !!(args.ruleId || args.type === 'edit')

  try {
    if (isEdit) {
      const ruleId = args.ruleId
      console.log('编辑数据流测量规则:', ruleId, values)
      modal.resolve({ ...values, ruleId, type: 'edit' })
    } else {
      console.log('新增数据流测量规则:', values)
      modal.resolve({ ...values, type: 'add' })
    }
    modal.hide()
  } catch (error) {
    console.error('提交失败:', error)
  }
}
</script>

<style scoped lang="scss"></style>
