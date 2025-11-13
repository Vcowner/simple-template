<!--
 * @Author: liaokt
 * @Description: 新增/编辑包级特征弹框组件
 * @Date: 2025-11-12 18:00:00
 * @LastEditors: liaokt
 * @LastEditTime: 2025-11-13 18:41:13
-->
<template>
  <MxFormModal :modal="modal" :rules="rules" layout="vertical" @ok="handleSubmit">
    <template #default="{ formData }">
      <!-- 前四个字段，一行两个 -->
      <MxFormRow :cols="2">
        <a-form-item label="数据包大小(KB)" name="packetSize" required>
          <a-input-number
            v-model:value="formData.packetSize"
            :min="0.1"
            :max="1000"
            :precision="1"
            :step="0.1"
            placeholder="范围: 0.1-1000 KB"
            style="width: 100%"
          />
        </a-form-item>
        <a-form-item label="TCP窗口大小(字节)" name="tcpWindow" required>
          <a-input-number
            v-model:value="formData.tcpWindow"
            :min="1024"
            :max="65535"
            :precision="0"
            placeholder="范围: 1024-65535 字节"
            style="width: 100%"
          />
        </a-form-item>
        <a-form-item label="端口号" name="port" required>
          <a-input-number
            v-model:value="formData.port"
            :min="1"
            :max="65535"
            :precision="0"
            placeholder="1-65535"
            style="width: 100%"
          />
        </a-form-item>
        <a-form-item label="MAC地址" name="mac" required>
          <a-input v-model:value="formData.mac" placeholder="XX:XX:XX:XX:XX:XX" :maxlength="17" />
        </a-form-item>
      </MxFormRow>

      <!-- 其他字段，单列 -->
      <a-form-item label="DNS域名字符串" name="dns">
        <a-input v-model:value="formData.dns" placeholder="可选" />
      </a-form-item>

      <a-form-item label="HTTP响应报文" name="httpStatus">
        <a-textarea v-model:value="formData.httpStatus" :rows="4" placeholder="可选" />
      </a-form-item>

      <a-form-item label="关联设备类型" name="deviceType" required>
        <a-select
          v-model:value="formData.deviceType"
          placeholder="请选择设备类型"
          :options="DEVICE_TYPE_OPTIONS"
        />
      </a-form-item>
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
  name: 'AddFeatureModal'
})

interface Props {
  /** Modal 实例（从 modalRegistry 传递） */
  modal?: UseModalReturn
}

const DEVICE_TYPE_OPTIONS: { label: string; value: string }[] = [
  { label: '智能电表', value: '智能电表' },
  { label: '配电终端', value: '配电终端' },
  { label: '采集器', value: '采集器' },
  { label: '其他', value: '其他' }
]

const props = defineProps<Props>()

// 获取 modal 实例
const modal = props.modal || useModal()

// 设备类型选项

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
  packetSize: [
    { required: true, message: '请输入数据包大小', trigger: 'blur' },
    { type: 'number', min: 0.1, max: 1000, message: '范围: 0.1-1000 KB', trigger: 'blur' }
  ],
  tcpWindow: [
    { required: true, message: '请输入TCP窗口大小', trigger: 'blur' },
    {
      type: 'number',
      min: 1024,
      max: 65535,
      message: '范围: 1024-65535 字节',
      trigger: 'blur'
    }
  ],
  port: [
    { required: true, message: '请输入端口号', trigger: 'blur' },
    { type: 'number', min: 1, max: 65535, message: '范围: 1-65535', trigger: 'blur' }
  ],
  mac: [{ validator: validateMac, trigger: 'blur' }],
  deviceType: [{ required: true, message: '请选择设备类型', trigger: 'change' }]
}

// 处理提交（确认按钮事件入口）
const handleSubmit = async (values: Record<string, any>) => {
  const args = toRaw(modal.args.value)
  const isEdit = !!(args.id || args.type === 'edit')
  try {
    if (isEdit) {
      // 编辑模式：调用更新接口
      const id = modal.args.value.id
      // TODO: 在这里调用更新接口
      // const result = await api.updateFeature(id, values)
      console.log('编辑特征:', id, values)

      // 接口成功后，关闭弹窗
      modal.resolve({ ...values, id, type: 'edit' })
      modal.hide()
    } else {
      // 新增模式：调用创建接口
      // TODO: 在这里调用创建接口
      // const result = await api.addFeature(values)
      console.log('新增特征:', values)

      // 接口成功后，关闭弹窗
      modal.resolve({ ...values, type: 'add' })
      modal.hide()
    }
  } catch (error) {
    // 接口失败，不关闭弹窗
    console.error('提交失败:', error)
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
