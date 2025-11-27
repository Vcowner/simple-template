<!--
 * @Author: liaokt
 * @Description: 新增 / 编辑数据流测量规则弹窗
 * @Date: 2025-11-13 19:20:00
 * @LastEditors: liaokt
 * @LastEditTime: 2025-11-27 09:16:08
-->
<template>
  <MxFormModal
    :modal="modal"
    :rules="rules"
    layout="vertical"
    :confirm-loading="confirmLoading"
    :body-loading="detailLoading"
    @ok="handleSubmit"
  >
    <template #default="{ formData }">
      <MxFormRow :cols="1">
        <a-form-item label="规则名称" name="rule_name" required>
          <a-input v-model:value="formData.rule_name" placeholder="请输入规则名称" />
        </a-form-item>

        <a-form-item label="测量维度" name="measure_length" required>
          <a-select
            v-model:value="formData.measure_length"
            :options="FLOW_RULE_METRIC_OPTIONS"
            placeholder="请选择测量维度"
          />
        </a-form-item>

        <a-form-item label="阈值范围" name="threshold_range" required>
          <a-input
            v-model:value="formData.threshold_range"
            placeholder="请输入阈值范围，例如 5-100 KB"
          />
        </a-form-item>
      </MxFormRow>
    </template>
  </MxFormModal>
</template>

<script setup lang="ts">
import { toRaw, computed, watch, nextTick } from 'vue'
import { MxFormModal, useModal } from '@/components/MxModal'
import type { UseModalReturn } from '@/components/MxModal/useModal'
import { MxFormRow } from '@/components/MxFormLayout'
import type { Rule } from 'ant-design-vue/es/form'
import { useRequest } from '@/hooks/useRequest'
import {
  createFlowRule,
  updateFlowRule,
  getFlowRuleDetail,
  type CreateFlowRuleParams,
  type FlowRule
} from '@/api/flow-rules'
import { FLOW_RULE_METRIC_OPTIONS } from '../../../dictkey'

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

// 格式化编辑数据：将接口返回的字段映射到表单字段
const normalizeEditData = (data: FlowRule) => {
  return {
    ...data,
    // 将接口返回的 measure_length 映射到表单的 measure_length
    measure_length: data.measure_length
  }
}

// 使用 useRequest 创建获取详情功能
const { run: runGetDetail, loading: detailLoading } = useRequest(getFlowRuleDetail, {
  manual: true,
  showMessage: false,
  onSuccess: response => {
    // 获取详情成功后，格式化数据并更新到 modal.args.data
    const detailData = response.data
    if (detailData) {
      const formattedData = normalizeEditData(detailData)
      // 更新 modal args，这样 MxFormModal 会自动获取新数据
      modal.update({ data: formattedData })
    }
  },
  onError: error => {
    console.error('获取详情失败:', error)
  }
})

// 监听弹窗打开，如果是编辑模式则获取详情
watch(
  () => modal.visible.value,
  async visible => {
    // 只在从关闭变为打开时执行
    if (visible) {
      const args = toRaw(modal.args.value)
      const isEdit = !!(args.id || args.type === 'edit')
      if (isEdit && args.id) {
        try {
          await runGetDetail({ id: args.id })
        } catch (error) {
          console.error('获取详情失败:', error)
        }
      }
    }
  },
  { immediate: true }
)

// 表单验证规则
const rules: Record<string, Rule[]> = {
  rule_name: [{ required: true, message: '请输入规则名称', trigger: 'blur' }],
  measure_length: [{ required: true, message: '请选择测量维度', trigger: 'change' }],
  threshold_range: [{ required: true, message: '请输入阈值范围', trigger: 'blur' }]
}

// 处理提交
const { run: runCreate, loading: createLoading } = useRequest(createFlowRule, {
  manual: true,
  showMessage: true,
  successMessage: '新增数据流测量规则成功'
})

const { run: runUpdate, loading: updateLoading } = useRequest(updateFlowRule, {
  manual: true,
  showMessage: true,
  successMessage: '更新数据流测量规则成功'
})

const confirmLoading = computed(() => createLoading.value || updateLoading.value)

const handleSubmit = async (values: Record<string, any>) => {
  const args = toRaw(modal.args.value)
  const isEdit = !!(args.id || args.type === 'edit')

  // 将表单字段映射到接口字段：measure_length -> measure_length
  const apiParams: CreateFlowRuleParams = {
    rule_name: values.rule_name,
    measure_length: values.measure_length, // 映射字段
    threshold_range: values.threshold_range
  }

  try {
    if (isEdit) {
      if (!args.id) {
        throw new Error('规则ID不能为空')
      }
      await runUpdate({
        id: args.id,
        ...apiParams
      })
      modal.resolve({ type: 'edit', id: args.id })
    } else {
      await runCreate(apiParams)
      modal.resolve({ type: 'add' })
    }
    modal.hide()
  } catch (error) {
    console.error('提交失败:', error)
    throw error
  }
}
</script>

<style scoped lang="scss"></style>
