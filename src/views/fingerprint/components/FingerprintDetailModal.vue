<!--
 * @Author: liaokt
 * @Description: 设备指纹详情弹窗
 * @Date: 2025-11-14 01:00:00
 * @LastEditors: liaokt
 * @LastEditTime: 2025-11-27 11:18:23
-->
<template>
  <MxModal :modal="modal" :show-ok="false" :show-cancel="false" :body-loading="detailLoading">
    <template #title>
      <div class="fingerprint-detail-modal__title">
        设备指纹详情
        <span v-if="data.device_name" class="fingerprint-detail-modal__subtitle">
          {{ data.device_name }} ({{ data.fingerprint_id }})
        </span>
      </div>
    </template>

    <div class="fingerprint-detail-modal__content">
      <!-- Tab 切换 -->
      <div class="fingerprint-detail-modal__tabs">
        <a-radio-group v-model:value="activeTab" button-style="solid">
          <a-radio-button value="packet">包级特征</a-radio-button>
          <a-radio-button value="flow">流级特征</a-radio-button>
        </a-radio-group>
      </div>

      <!-- 包级特征 -->
      <div v-if="activeTab === 'packet'" class="fingerprint-detail-modal__section">
        <MxFormRow :cols="2" :gutter="[32, 24]">
          <a-form-item label="特征ID">
            <span>{{ packetFeatures?.feature_id || '-' }}</span>
          </a-form-item>
          <a-form-item label="数据包大小">
            <span>{{ packetFeatures?.packet_size || '-' }}</span>
          </a-form-item>
          <a-form-item label="端口号">
            <span>{{ packetFeatures?.port_number || '-' }}</span>
          </a-form-item>
          <a-form-item label="MAC地址">
            <span>{{ packetFeatures?.mac_address || '-' }}</span>
          </a-form-item>
          <a-form-item label="TCP窗口大小">
            <span>{{ packetFeatures?.tcp_window_size || '-' }}</span>
          </a-form-item>
          <a-form-item label="DNS域名字符串">
            <span>{{ packetFeatures?.dns_domain || '-' }}</span>
          </a-form-item>
          <a-form-item label="HTTP响应报文">
            <span>{{ packetFeatures?.http_response || '-' }}</span>
          </a-form-item>
          <a-form-item label="设备类型">
            <a-tag color="blue">{{ packetFeatures?.device_type_display || '-' }}</a-tag>
          </a-form-item>
        </MxFormRow>
      </div>

      <!-- 流级特征 -->
      <div v-if="activeTab === 'flow'" class="fingerprint-detail-modal__section">
        <MxFormRow :cols="2" :gutter="[32, 24]">
          <a-form-item label="特征ID">
            <span>{{ flowFeatures?.feature_id || '-' }}</span>
          </a-form-item>
          <a-form-item label="数据流长度">
            <span>{{ flowFeatures?.data_flow_length || '-' }}</span>
          </a-form-item>
          <a-form-item label="持续时间">
            <span>{{ flowFeatures?.duration || '-' }}</span>
          </a-form-item>
          <a-form-item label="IP协议版本">
            <span>{{ flowFeatures?.ip_version_display || '-' }}</span>
          </a-form-item>
          <a-form-item label="TCP标记">
            <div
              v-if="flowFeatures?.tcp_flags_list && flowFeatures.tcp_flags_list.length > 0"
              class="tcp-flags"
            >
              <a-tag v-for="flag in flowFeatures.tcp_flags_list" :key="flag" color="blue">{{
                flag
              }}</a-tag>
            </div>
            <span v-else>-</span>
          </a-form-item>
          <a-form-item label="关联规则">
            <span>{{ flowFeatures?.related_rule_name || '-' }}</span>
          </a-form-item>
        </MxFormRow>
      </div>

      <!-- 底部信息 -->
      <div class="fingerprint-detail-modal__footer-info">
        <MxFormRow :cols="3" :gutter="[32, 24]">
          <a-form-item label="设备类型">
            <a-tag color="blue">{{ data.device_type_display || '-' }}</a-tag>
          </a-form-item>
          <a-form-item label="更新时间">
            <span>{{ data.updated_at ? formatTime(data.updated_at) : '-' }}</span>
          </a-form-item>
          <a-form-item label="关联模型ID">
            <span>{{ data.related_model_id || '-' }}</span>
          </a-form-item>
        </MxFormRow>
      </div>
    </div>

    <template #footer>
      <div class="fingerprint-detail-modal__footer">
        <a-button type="primary" @click="handleClose">关闭</a-button>
      </div>
    </template>
  </MxModal>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { toRaw } from 'vue'
import { MxModal, useModal, type UseModalReturn } from '@/components/MxModal'
import { MxFormRow } from '@/components/MxFormLayout'
import { useRequest } from '@/hooks/useRequest'
import { getDeviceFingerprintDetail, type DeviceFingerprint } from '@/api/device-fingerprints'
import { formatTime } from '@/utils/time/time'

defineOptions({
  name: 'FingerprintDetailModal'
})

interface Props {
  modal?: UseModalReturn
}

const props = defineProps<Props>()

const modal = props.modal || useModal()

const activeTab = ref<'packet' | 'flow'>('packet')

// 使用 useRequest 创建获取详情功能
const {
  run: runGetDetail,
  data: detailResponse,
  loading: detailLoading
} = useRequest(getDeviceFingerprintDetail, {
  manual: true,
  showMessage: false
})

const detailData = computed<DeviceFingerprint | null>(() => {
  const response = detailResponse.value as any
  // useRequest 返回的 data 是完整的响应对象 { code, data, message, success }
  // 所以需要从 response.data 中获取真正的数据
  if (response?.data) {
    return response.data
  }
  return null
})

// 使用标志位防止重复调用
let isFetching = false

// 监听弹窗打开，获取详情
watch(
  () => modal.visible.value,
  (visible, prevVisible) => {
    // 只在从关闭变为打开时执行，或者首次打开时（prevVisible 为 undefined）
    if (visible && (prevVisible === false || prevVisible === undefined)) {
      if (isFetching) return // 防止重复调用

      isFetching = true
      nextTick(() => {
        const args = toRaw(modal.args.value)
        if (args.id) {
          runGetDetail({ id: args.id })
            .catch(error => {
              console.error('获取详情失败:', error)
            })
            .finally(() => {
              isFetching = false
            })
        } else {
          isFetching = false
        }
      })
    } else if (!visible) {
      // 弹窗关闭时重置标志位
      isFetching = false
    }
  },
  { immediate: true }
)

const data = computed(() => {
  return detailData.value || ({} as DeviceFingerprint)
})

// 包级特征（直接使用 packet_features_display 对象）
const packetFeatures = computed(() => {
  return data.value.packet_features_display || null
})

// 流级特征（直接使用 flow_features_display 对象）
const flowFeatures = computed(() => {
  const features = data.value.flow_features_display
  return features || null
})

// 监听数据变化，用于调试
watch(
  () => detailResponse.value,
  response => {
    if (response) {
      console.log('详情响应:', response)
      console.log('详情数据:', (response as any)?.data)
      console.log('流级特征:', (response as any)?.data?.flow_features_display)
    }
  },
  { deep: true }
)

const handleClose = () => {
  modal.hide()
}
</script>

<style scoped lang="scss">
.fingerprint-detail-modal__title {
  display: flex;
  gap: 8px;
  align-items: center;
}

.fingerprint-detail-modal__subtitle {
  font-size: 14px;
  font-weight: 400;
  color: #8c8c8c;
}

.fingerprint-detail-modal__content {
  padding: 0;
}

.fingerprint-detail-modal__tabs {
  margin-bottom: 24px;

  :deep(.ant-radio-group) {
    display: flex;
    width: 100%;
  }

  :deep(.ant-radio-button-wrapper) {
    flex: 1;
    text-align: center;
  }
}

.fingerprint-detail-modal__section {
  margin-bottom: 24px;
}

.fingerprint-detail-modal__footer-info {
  padding-top: 24px;
  border-top: 1px solid #f0f0f0;
}

.fingerprint-detail-modal__footer {
  display: flex;
  justify-content: flex-end;
}

.tcp-flags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
