<!--
 * @Author: liaokt
 * @Description: 新增/编辑包级特征弹框组件
 * @Date: 2025-11-12 18:00:00
 * @LastEditors: liaokt
 * @LastEditTime: 2025-11-26 14:48:25
-->
<template>
  <MxFormModal
    :modal="modal"
    :body-loading="detailLoading"
    :rules="rules"
    layout="vertical"
    @ok="handleSubmit"
  >
    <template #default="{ formData }">
      <!-- 前四个字段，一行两个 -->
      <MxFormRow :cols="2">
        <a-form-item label="数据包大小(KB)" name="packet_size" required>
          <a-input-number
            v-model:value="formData.packet_size"
            :min="0.1"
            :max="1000"
            :precision="1"
            :step="0.1"
            placeholder="范围: 0.1-1000 KB"
            style="width: 100%"
          />
        </a-form-item>
        <a-form-item label="TCP窗口大小(字节)" name="tcp_window_size" required>
          <a-input-number
            v-model:value="formData.tcp_window_size"
            :min="1024"
            :max="65535"
            :precision="0"
            placeholder="范围: 1024-65535 字节"
            style="width: 100%"
          />
        </a-form-item>
        <a-form-item label="端口号" name="port_number" required>
          <a-input-number
            v-model:value="formData.port_number"
            :min="1"
            :max="65535"
            :precision="0"
            placeholder="1-65535"
            style="width: 100%"
          />
        </a-form-item>
        <a-form-item label="MAC地址" name="mac_address" required>
          <a-input
            v-model:value="formData.mac_address"
            placeholder="XX:XX:XX:XX:XX:XX"
            :maxlength="17"
          />
        </a-form-item>
      </MxFormRow>

      <!-- 其他字段，单列 -->
      <a-form-item label="DNS域名字符串" name="dns_domain">
        <a-input v-model:value="formData.dns_domain" placeholder="可选" />
      </a-form-item>

      <a-form-item label="HTTP响应报文" name="http_response">
        <a-textarea v-model:value="formData.http_response" :rows="4" placeholder="可选" />
      </a-form-item>

      <a-form-item label="关联设备类型" name="device_type" required>
        <a-select
          v-model:value="formData.device_type"
          placeholder="请选择设备类型"
          :options="DEVICE_TYPE_SELECT_OPTIONS"
        />
      </a-form-item>
    </template>
  </MxFormModal>
</template>

<script setup lang="ts">
import { toRaw, watch } from 'vue'
import { MxFormModal, useModal } from '@/components/MxModal'
import type { UseModalReturn } from '@/components/MxModal/useModal'
import { MxFormRow } from '@/components/MxFormLayout'
import type { Rule } from 'ant-design-vue/es/form'
import { useRequest } from '@/hooks/useRequest'
import { DEVICE_TYPE_OPTIONS } from '../dictkey'
import { createPacketFeature, updatePacketFeature, getPacketFeatureDetail } from '@/api'

defineOptions({
  name: 'AddFeatureModal'
})

interface Props {
  /** Modal 实例（从 modalRegistry 传递） */
  modal?: UseModalReturn
}

const props = defineProps<Props>()

// 获取 modal 实例
const modal = props.modal || useModal()

// 转换设备类型选项格式（从 { key, value } 转为 { label, value }）
const DEVICE_TYPE_SELECT_OPTIONS = DEVICE_TYPE_OPTIONS.filter(item => item.key !== 'all').map(
  item => ({
    label: item.value,
    value: item.key
  })
)

// MAC地址验证规则
const validateMac = (_rule: Rule, value: string) => {
  if (!value) {
    return Promise.reject(new Error('请输入MAC地址'))
  }
  const macRegex = /^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/
  if (!macRegex.test(value)) {
    return Promise.reject(new Error('MAC地址格式不正确，应为 XX:XX:XX:XX:XX:XX'))
  }
  return Promise.resolve()
}

// 表单验证规则
const rules: Record<string, Rule[]> = {
  packet_size: [
    { required: true, message: '请输入数据包大小', trigger: 'blur' },
    { type: 'number', min: 0.1, max: 1000, message: '范围: 0.1-1000 KB', trigger: 'blur' }
  ],
  tcp_window_size: [
    { required: true, message: '请输入TCP窗口大小', trigger: 'blur' },
    {
      type: 'number',
      min: 1024,
      max: 65535,
      message: '范围: 1024-65535 字节',
      trigger: 'blur'
    }
  ],
  port_number: [
    { required: true, message: '请输入端口号', trigger: 'blur' },
    { type: 'number', min: 1, max: 65535, message: '范围: 1-65535', trigger: 'blur' }
  ],
  mac_address: [{ validator: validateMac, trigger: 'blur' }],
  device_type: [{ required: true, message: '请选择设备类型', trigger: 'change' }]
}

// 格式化编辑数据：将字符串转为数字
const normalizeEditData = (data: any) => {
  const toNumber = (value: any) => {
    const num = Number(value)
    return Number.isNaN(num) ? undefined : num
  }

  return {
    ...data,
    packet_size: toNumber(data.packet_size),
    tcp_window_size: toNumber(data.tcp_window_size),
    port_number: toNumber(data.port_number)
  }
}

// 使用 useRequest 创建获取详情功能
const { run: runGetDetail, loading: detailLoading } = useRequest(getPacketFeatureDetail, {
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

// 使用 useRequest 创建新增功能
const { run: runCreate } = useRequest(createPacketFeature, {
  manual: true,
  showMessage: true,
  successMessage: '新增成功',
  onSuccess: () => {
    // 接口成功后，关闭弹窗
    modal.resolve({ type: 'add' })
    modal.hide()
  },
  onError: error => {
    console.error('新增失败:', error)
  }
})

// 使用 useRequest 创建更新功能
const { run: runUpdate } = useRequest(updatePacketFeature, {
  manual: true,
  showMessage: true,
  successMessage: '更新成功',
  onSuccess: () => {
    // 接口成功后，关闭弹窗
    const id = modal.args.value.id || modal.args.value.data?.id
    modal.resolve({ id, type: 'edit' })
    modal.hide()
  },
  onError: error => {
    console.error('更新失败:', error)
  }
})

// 处理提交（确认按钮事件入口）
const handleSubmit = async (values: Record<string, any>) => {
  const args = toRaw(modal.args.value)
  const isEdit = !!(args.id || args.type === 'edit')

  // 转换数据格式：将数字转为字符串（packet_size, tcp_window_size）
  const formattedValues = {
    packet_size: String(values.packet_size || ''),
    tcp_window_size: String(values.tcp_window_size || ''),
    port_number: values.port_number,
    mac_address: values.mac_address,
    dns_domain: values.dns_domain || null,
    http_response: values.http_response || null,
    device_type: values.device_type
  }

  try {
    if (isEdit) {
      // 编辑模式：使用 useRequest 调用更新接口
      const id = modal.args.value.id || modal.args.value.data?.id
      await runUpdate({ id, data: formattedValues })
    } else {
      // 新增模式：使用 useRequest 调用创建接口
      await runCreate({ data: formattedValues })
    }
  } catch (error) {
    // 接口失败，不关闭弹窗（错误已在 useRequest 中处理）
    console.error('提交失败:', error)
    throw error // 重新抛出错误，让表单知道提交失败
  }
}
</script>

<style scoped lang="scss">
.add-feature-modal__tip {
  margin-bottom: 24px;
  padding: 12px 16px;
  background: #f0f7ff;
  border-radius: 4px;
  color: #1890ff;
  font-size: 14px;

  .required {
    color: #ff4d4f;
    margin: 0 2px;
  }
}

:deep(.ant-form-item-label > label) {
  &::before {
    content: '';
    display: none;
  }

  &.ant-form-item-required::before {
    display: inline-block;
    margin-right: 4px;
    color: #ff4d4f;
    font-size: 14px;
    font-family: SimSun, sans-serif;
    line-height: 1;
    content: '*';
  }
}
</style>
