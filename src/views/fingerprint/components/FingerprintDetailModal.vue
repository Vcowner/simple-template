<!--
 * @Author: liaokt
 * @Description: 设备指纹详情弹窗
 * @Date: 2025-11-14 01:00:00
 * @LastEditors: liaokt
 * @LastEditTime: 2025-11-14 00:03:05
-->
<template>
  <MxModal :modal="modal" :show-ok="false" :show-cancel="false">
    <template #title>
      <div class="fingerprint-detail-modal__title">
        设备指纹详情
        <span class="fingerprint-detail-modal__subtitle">
          {{ data.deviceName }} ({{ data.fingerprintId }})
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
          <a-form-item label="数据包大小">
            <span>{{ packetFeatures.packetSize || '-' }}</span>
          </a-form-item>
          <a-form-item label="端口号">
            <span>{{ packetFeatures.port || '-' }}</span>
          </a-form-item>
          <a-form-item label="DNS域名字符串">
            <span>{{ packetFeatures.dnsDomain || '-' }}</span>
          </a-form-item>
          <a-form-item label="HTTP响应报文">
            <span>{{ packetFeatures.httpResponse || '-' }}</span>
          </a-form-item>
          <a-form-item label="TCP窗口大小">
            <span>{{ packetFeatures.tcpWindowSize || '-' }}</span>
          </a-form-item>
          <a-form-item label="MAC地址">
            <span>{{ packetFeatures.macAddress || '-' }}</span>
          </a-form-item>
        </MxFormRow>
      </div>

      <!-- 流级特征 -->
      <div v-if="activeTab === 'flow'" class="fingerprint-detail-modal__section">
        <MxFormRow :cols="2" :gutter="[32, 24]">
          <a-form-item label="数据流长度">
            <span>{{ flowFeatures.flowLength || '-' }}</span>
          </a-form-item>
          <a-form-item label="TCP标记">
            <div v-if="flowFeatures.tcpFlags && flowFeatures.tcpFlags.length > 0" class="tcp-flags">
              <a-tag v-for="flag in flowFeatures.tcpFlags" :key="flag" color="blue">{{
                flag
              }}</a-tag>
            </div>
            <span v-else>-</span>
          </a-form-item>
          <a-form-item label="持续时间">
            <span>{{ flowFeatures.duration || '-' }}</span>
          </a-form-item>
          <a-form-item label="IP协议版本">
            <span>{{ flowFeatures.ipProtocol || '-' }}</span>
          </a-form-item>
        </MxFormRow>
      </div>

      <!-- 底部信息 -->
      <div class="fingerprint-detail-modal__footer-info">
        <MxFormRow :cols="3" :gutter="[32, 24]">
          <a-form-item label="设备类型">
            <a-tag color="blue">{{ data.deviceType || '-' }}</a-tag>
          </a-form-item>
          <a-form-item label="最后更新时间">
            <span>{{ data.updateTime || '-' }}</span>
          </a-form-item>
          <a-form-item label="关联模型ID">
            <span>{{ data.associatedModelId || '-' }}</span>
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
import { ref, computed } from 'vue'
import { MxModal, useModal } from '@/components/MxModal'
import { MxFormRow } from '@/components/MxFormLayout'

const modal = useModal()

const activeTab = ref<'packet' | 'flow'>('packet')

const data = computed(() => {
  const args = modal.args.value
  if (args.data && typeof args.data === 'object') {
    return args.data as Record<string, any>
  }
  return modal.getFormData()
})

// 解析包级特征
const packetFeatures = computed(() => {
  const features = data.value.packetFeatures || ''
  const result: Record<string, string> = {}

  // 解析格式：包大小:1.5KB, 端口:502, MAC:00:...
  if (features) {
    const parts = features.split(',').map((s: string) => s.trim())
    parts.forEach((part: string) => {
      if (part.includes('包大小:')) {
        result.packetSize = part.replace('包大小:', '').trim()
      } else if (part.includes('端口:')) {
        result.port = part.replace('端口:', '').trim()
      } else if (part.includes('MAC:')) {
        result.macAddress = part.replace('MAC:', '').trim()
      }
    })
  }

  // 模拟数据（实际应该从后端获取完整数据）
  if (data.value.fingerprintId === 'FP001') {
    return {
      packetSize: '1.5 KB',
      port: '502',
      dnsDomain: 'modbus.device.local',
      httpResponse: 'HTTP/1.1 200 OK',
      tcpWindowSize: '8192 字节',
      macAddress: '00:1A:2B:3C:4D:5E',
      ...result
    }
  } else if (data.value.fingerprintId === 'FP002') {
    return {
      packetSize: '2.1 KB',
      port: '80',
      dnsDomain: '-',
      httpResponse: 'HTTP/1.1 200 OK',
      tcpWindowSize: '65535 字节',
      macAddress: '00:2B:3C:4D:5E:6F',
      ...result
    }
  } else if (data.value.fingerprintId === 'FP003') {
    return {
      packetSize: '0.8 KB',
      port: '443',
      dnsDomain: '-',
      httpResponse: 'HTTP/1.1 200 OK',
      tcpWindowSize: '4096 字节',
      macAddress: '00:3C:4D:5E:6F:70',
      ...result
    }
  }

  return result
})

// 解析流级特征
const flowFeatures = computed(() => {
  const features = data.value.flowFeatures || ''
  const result: Record<string, any> = {}

  // 解析格式：流长度:25.5KB, 时长:15.2s, 协议:I...
  if (features) {
    const parts = features.split(',').map((s: string) => s.trim())
    parts.forEach((part: string) => {
      if (part.includes('流长度:')) {
        result.flowLength = part.replace('流长度:', '').trim()
      } else if (part.includes('时长:')) {
        result.duration = part.replace('时长:', '').trim()
      } else if (part.includes('协议:')) {
        result.ipProtocol = part.replace('协议:', '').trim()
      }
    })
  }

  // 模拟数据（实际应该从后端获取完整数据）
  if (data.value.fingerprintId === 'FP001') {
    return {
      flowLength: '25.5 KB',
      tcpFlags: ['SYN', 'ACK'],
      duration: '15.2 秒',
      ipProtocol: 'IPv4',
      ...result
    }
  } else if (data.value.fingerprintId === 'FP002') {
    return {
      flowLength: '8.3 KB',
      tcpFlags: ['SYN', 'ACK', 'FIN'],
      duration: '5.8 秒',
      ipProtocol: 'IPv6',
      ...result
    }
  } else if (data.value.fingerprintId === 'FP003') {
    return {
      flowLength: '12.7 KB',
      tcpFlags: ['SYN'],
      duration: '8.9 秒',
      ipProtocol: 'IPv4',
      ...result
    }
  }

  return result
})

const handleClose = () => {
  modal.hide()
}
</script>

<style scoped lang="scss">
.fingerprint-detail-modal__title {
  display: flex;
  align-items: center;
  gap: 8px;
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
  gap: 8px;
  flex-wrap: wrap;
}
</style>
