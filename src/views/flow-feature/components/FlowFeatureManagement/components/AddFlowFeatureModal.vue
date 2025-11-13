<!--
 * @Author: liaokt
 * @Description: 新增 / 编辑流级特征弹窗
 * @Date: 2025-11-13 20:50:00
 * @LastEditors: liaokt
 * @LastEditTime: 2025-11-13 20:50:00
-->
<template>
  <MxFormModal :modal="modal" :rules="rules" layout="vertical" @ok="handleSubmit">
    <template #default="{ formData }">
      <div class="add-flow-feature-modal__hint">请填写流级特征信息，所有字段均为必填</div>
      <MxFormRow :cols="1">
        <a-form-item label="数据流长度(KB)" name="dataFlowLength" required>
          <a-input-number
            v-model:value="formData.dataFlowLength"
            :min="0"
            :precision="1"
            placeholder="请输入数据流长度"
            style="width: 100%"
          />
        </a-form-item>

        <a-form-item label="持续时间(秒)" name="duration" required>
          <a-input-number
            v-model:value="formData.duration"
            :min="0"
            :precision="1"
            placeholder="请输入持续时间"
            style="width: 100%"
          />
        </a-form-item>

        <a-form-item label="TCP标记" name="tcpFlags" required>
          <a-checkbox-group v-model:value="formData.tcpFlags">
            <a-checkbox value="SYN">SYN</a-checkbox>
            <a-checkbox value="RST">RST</a-checkbox>
            <a-checkbox value="ACK">ACK</a-checkbox>
            <a-checkbox value="PSH">PSH</a-checkbox>
            <a-checkbox value="FIN">FIN</a-checkbox>
            <a-checkbox value="URG">URG</a-checkbox>
          </a-checkbox-group>
        </a-form-item>

        <a-form-item label="IP协议版本" name="ipProtocolVersion" required>
          <a-select
            v-model:value="formData.ipProtocolVersion"
            :options="ipProtocolOptions"
            placeholder="请选择IP协议版本"
          />
        </a-form-item>

        <a-form-item label="关联规则ID" name="associatedRuleId" required>
          <a-select
            v-model:value="formData.associatedRuleId"
            :options="ruleOptions"
            placeholder="请选择关联规则"
            :loading="ruleLoading"
            show-search
            :filter-option="filterRuleOption"
          />
        </a-form-item>
      </MxFormRow>
    </template>
  </MxFormModal>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { toRaw } from 'vue'
import { MxFormModal, useModal } from '@/components/MxModal'
import type { UseModalReturn } from '@/components/MxModal/useModal'
import { MxFormRow } from '@/components/MxFormLayout'
import type { Rule } from 'ant-design-vue/es/form'

defineOptions({
  name: 'AddFlowFeatureModal'
})

interface Props {
  /** Modal 实例（从 modalRegistry 传递） */
  modal?: UseModalReturn
}

const props = defineProps<Props>()

// 获取 modal 实例
const modal = props.modal || useModal()

const ipProtocolOptions = [
  { label: 'IPv4', value: 'IPv4' },
  { label: 'IPv6', value: 'IPv6' }
]

const ruleOptions = ref<Array<{ label: string; value: string }>>([])
const ruleLoading = ref(false)

// 获取数据流测量规则列表
const fetchRuleList = async () => {
  ruleLoading.value = true
  try {
    // 模拟 API 调用
    await new Promise(resolve => setTimeout(resolve, 300))
    const mockRules = [
      {
        id: 'FR001',
        ruleId: 'FR001',
        ruleName: '配电终端数据流规则'
      },
      {
        id: 'FR002',
        ruleId: 'FR002',
        ruleName: '智能电表通信规则'
      }
    ]

    ruleOptions.value = mockRules.map(rule => ({
      label: `${rule.ruleName} (${rule.ruleId})`,
      value: rule.ruleId
    }))
  } catch (error) {
    console.error('获取规则列表失败:', error)
  } finally {
    ruleLoading.value = false
  }
}

// 规则下拉框搜索过滤
const filterRuleOption = (input: string, option: any) => {
  return option.label.toLowerCase().includes(input.toLowerCase())
}

onMounted(() => {
  fetchRuleList()
})

// 表单验证规则
const rules: Record<string, Rule[]> = {
  dataFlowLength: [{ required: true, message: '请输入数据流长度', trigger: 'blur' }],
  duration: [{ required: true, message: '请输入持续时间', trigger: 'blur' }],
  tcpFlags: [{ required: true, message: '请至少选择一个TCP标记', trigger: 'change' }],
  ipProtocolVersion: [{ required: true, message: '请选择IP协议版本', trigger: 'change' }],
  associatedRuleId: [{ required: true, message: '请选择关联规则', trigger: 'change' }]
}

// 处理提交
const handleSubmit = async (values: Record<string, any>) => {
  const args = toRaw(modal.args.value)
  const isEdit = !!(args.featureId || args.type === 'edit')

  try {
    if (isEdit) {
      const featureId = args.featureId
      console.log('编辑流级特征:', featureId, values)
      modal.resolve({ ...values, featureId, type: 'edit' })
    } else {
      console.log('新增流级特征:', values)
      modal.resolve({ ...values, type: 'add' })
    }
    modal.hide()
  } catch (error) {
    console.error('提交失败:', error)
  }
}
</script>

<style scoped lang="scss">
.add-flow-feature-modal__hint {
  margin-bottom: 16px;
  padding: 8px 12px;
  background: #f0f7ff;
  border-radius: 4px;
  color: #1890ff;
  font-size: 14px;
}
</style>
