<!--
 * @Author: liaokt
 * @Description: 新增 / 编辑流级特征弹窗
 * @Date: 2025-11-13 20:50:00
 * @LastEditors: liaokt
 * @LastEditTime: 2025-11-27 09:27:28
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
      <div class="add-flow-feature-modal__hint">请填写流级特征信息，所有字段均为必填</div>
      <MxFormRow :cols="1">
        <a-form-item label="数据流长度(KB)" name="data_flow_length" required>
          <a-input-number
            v-model:value="formData.data_flow_length"
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

        <a-form-item label="TCP标记" name="tcp_flags" required>
          <a-checkbox-group v-model:value="formData.tcp_flags">
            <a-checkbox value="SYN">SYN</a-checkbox>
            <a-checkbox value="RST">RST</a-checkbox>
            <a-checkbox value="ACK">ACK</a-checkbox>
            <a-checkbox value="PSH">PSH</a-checkbox>
            <a-checkbox value="FIN">FIN</a-checkbox>
            <a-checkbox value="URG">URG</a-checkbox>
          </a-checkbox-group>
        </a-form-item>

        <a-form-item label="IP协议版本" name="ip_version" required>
          <a-select
            v-model:value="formData.ip_version"
            :options="ipProtocolOptions"
            placeholder="请选择IP协议版本"
          />
        </a-form-item>

        <a-form-item label="关联规则" name="related_rule" required>
          <a-select
            v-model:value="formData.related_rule"
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
import { ref, computed, watch, nextTick } from 'vue'
import { toRaw } from 'vue'
import { MxFormModal, useModal } from '@/components/MxModal'
import type { UseModalReturn } from '@/components/MxModal/useModal'
import { MxFormRow } from '@/components/MxFormLayout'
import type { Rule } from 'ant-design-vue/es/form'
import { useRequest } from '@/hooks/useRequest'
import {
  createFlowFeature,
  updateFlowFeature,
  getFlowFeatureDetail,
  type CreateFlowFeatureParams,
  type FlowFeature
} from '@/api/flow-features'
import { getFlowRulesList } from '@/api/flow-rules'

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

const ruleOptions = ref<Array<{ label: string; value: number }>>([])
const ruleLoading = ref(false)

// 获取数据流测量规则列表
const fetchRuleList = async () => {
  ruleLoading.value = true
  try {
    const response = await getFlowRulesList()
    if (response.data && Array.isArray(response.data)) {
      ruleOptions.value = response.data.map(rule => ({
        label: `${rule.rule_name} (${rule.rule_id})`,
        value: rule.id
      }))
    }
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

// 初始化时获取规则列表
fetchRuleList()

// 格式化编辑数据：将接口返回的字段映射到表单字段
const normalizeEditData = (data: FlowFeature) => {
  return {
    ...data,
    // 将接口返回的 tcp_flags_list 映射到表单的 tcp_flags
    tcp_flags: data.tcp_flags_list || []
  }
}

// 使用 useRequest 创建获取详情功能
const { run: runGetDetail, loading: detailLoading } = useRequest(getFlowFeatureDetail, {
  manual: true,
  showMessage: false,
  onSuccess: response => {
    const detailData = response.data
    if (detailData) {
      const formattedData = normalizeEditData(detailData)
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
      await nextTick() // 等待 args 设置完成
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

// 使用 useRequest 创建新增功能
const { run: runCreate, loading: createLoading } = useRequest(createFlowFeature, {
  manual: true,
  showMessage: true,
  successMessage: '新增流级特征成功'
})

// 使用 useRequest 创建更新功能
const { run: runUpdate, loading: updateLoading } = useRequest(updateFlowFeature, {
  manual: true,
  showMessage: true,
  successMessage: '更新流级特征成功'
})

const confirmLoading = computed(() => createLoading.value || updateLoading.value)

// 表单验证规则
const rules: Record<string, Rule[]> = {
  data_flow_length: [{ required: true, message: '请输入数据流长度', trigger: 'blur' }],
  duration: [{ required: true, message: '请输入持续时间', trigger: 'blur' }],
  tcp_flags: [{ required: true, message: '请至少选择一个TCP标记', trigger: 'change' }],
  ip_version: [{ required: true, message: '请选择IP协议版本', trigger: 'change' }],
  related_rule: [{ required: true, message: '请选择关联规则', trigger: 'change' }]
}

// 处理提交
const handleSubmit = async (values: Record<string, any>) => {
  const args = toRaw(modal.args.value)
  const isEdit = !!(args.id || args.type === 'edit')

  // 将表单字段映射到接口字段
  const apiParams: CreateFlowFeatureParams = {
    data_flow_length: values.data_flow_length,
    duration: values.duration,
    tcp_flags: Array.isArray(values.tcp_flags) ? values.tcp_flags : [], // 确保是数组格式
    ip_version: values.ip_version,
    related_rule: values.related_rule
  }

  try {
    if (isEdit) {
      if (!args.id) {
        throw new Error('特征ID不能为空')
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

<style scoped lang="scss">
.add-flow-feature-modal__hint {
  padding: 8px 12px;
  margin-bottom: 16px;
  font-size: 14px;
  color: #1890ff;
  background: #f0f7ff;
  border-radius: 4px;
}
</style>
