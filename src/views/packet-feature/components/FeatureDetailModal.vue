<!--
 * @Author: liaokt
 * @Description: 特征详情弹窗组件
 * @Date: 2025-11-13 16:00:00
 * @LastEditors: liaokt
 * @LastEditTime: 2025-12-02 14:50:08
-->
<template>
  <MxDetailModal
    :modal="modal"
    :fields="detailFields"
    :body-loading="detailLoading"
    custom-class="feature-detail-modal"
    :show-ok="false"
    :show-cancel="false"
  >
    <template #header>
      <div class="feature-detail-modal__subtitle">包级特征详细信息</div>
    </template>
    <template #footer>
      <div class="feature-detail-modal__footer">
        <a-button type="primary" @click="handleClose">关闭</a-button>
      </div>
    </template>
  </MxDetailModal>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useModal, useAsyncFormData, type UseModalReturn } from '@/components/MxModal'
import MxDetailModal from '@/components/MxModal/MxDetailModal.vue'
import type { DetailFieldOrGroup } from '@/components/MxModal/MxDetailModal.vue'
import MacAddressValue from './MacAddressValue.vue'
import type { PacketFeature } from '@/api/pakcet-features'

defineOptions({
  name: 'FeatureDetailModal'
})

interface Props {
  /** Modal 实例（从 modalRegistry 传递） */
  modal?: UseModalReturn
}

const props = defineProps<Props>()

// 获取 modal 实例
const modal = props.modal || useModal()

// Mock 获取详情接口（用于测试）
const mockGetPacketFeatureDetail = async (
  args: Record<string, any>
): Promise<PacketFeature | null> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 500))

  const id = args.id
  if (!id) {
    return null
  }

  // 生成 mock 数据
  return {
    id: id,
    feature_id: `FEATURE_${String(id).padStart(6, '0')}`,
    packet_size: String(Math.floor(Math.random() * 900) + 100),
    tcp_window_size: String(Math.floor(Math.random() * 64511) + 1024),
    port_number: Math.floor(Math.random() * 65534) + 1,
    mac_address: Array.from({ length: 6 }, () =>
      Math.floor(Math.random() * 256)
        .toString(16)
        .padStart(2, '0')
    )
      .join(':')
      .toUpperCase(),
    dns_domain: `example${id}.com`,
    http_response: `HTTP/1.1 200 OK\nContent-Type: text/html\n\nMock Response ${id}`,
    device_type: 'smart_meter',
    device_type_display: '智能电表',
    created_at: new Date().toISOString()
  }
}

// 使用 useAsyncFormData 简化异步数据加载
const { loading: detailLoading } = useAsyncFormData({
  modal,
  loadData: async args => {
    // 使用 mock 数据（可以切换为真实接口）
    const mockData = await mockGetPacketFeatureDetail(args)
    if (mockData) {
      return mockData
    }

    // 真实接口调用（如果需要）
    // const response = await getPacketFeatureDetail({ id: args.id })
    // return response.data

    return null
  }
  // 默认会更新到 modal.args.data，MxDetailModal 会自动获取
})

const detailFields = computed<DetailFieldOrGroup[]>(() => [
  {
    fields: [
      {
        key: 'feature_id',
        label: '特征ID'
      },
      {
        key: 'device_type_display',
        label: '设备类型',
        type: 'tag'
      },
      {
        key: 'packet_size',
        label: '数据包大小',
        suffix: ' KB'
      },
      {
        key: 'tcp_window_size',
        label: 'TCP窗口大小',
        suffix: ' 字节'
      },
      {
        key: 'port_number',
        label: '端口号'
      },
      {
        key: 'mac_address',
        label: 'MAC地址',
        component: MacAddressValue
      }
    ]
  },
  {
    fields: [
      {
        key: 'dns_domain',
        label: 'DNS域名字符串',
        span: 24
      },
      {
        key: 'http_response',
        label: 'HTTP响应报文',
        type: 'block',
        span: 24
      },
      {
        key: 'created_at',
        label: '创建时间',
        span: 24
      }
    ]
  }
])

// 处理关闭
const handleClose = () => {
  modal.hide()
}
</script>

<style scoped lang="scss">
.feature-detail-modal {
  min-width: 560px;

  &__subtitle {
    padding-bottom: 16px;
    margin-bottom: 24px;
    font-size: 13px;
    color: #8c8c8c;
    border-bottom: 1px solid #f0f0f0;
  }

  &__footer {
    display: flex;
    justify-content: flex-end;
    padding-top: 16px;
    border-top: 1px solid #f0f0f0;
  }

  :deep(.mx-detail-modal__label) {
    font-size: 13px;
    font-weight: 500;
    line-height: 1.6;
    color: #6f6f6f;
  }

  :deep(.mx-detail-modal__value) {
    font-size: 14px;
    font-weight: 500;
    line-height: 1.6;
    color: #1f1f1f;
    word-break: break-word;
  }

  :deep(.mx-detail-modal__value--tag .ant-tag) {
    padding: 3px 12px;
    margin-inline-end: 0;
    font-size: 13px;
    font-weight: 500;
    line-height: 22px;
    border-radius: 4px;
  }

  :deep(.mx-detail-modal__value--block) {
    display: inline-block;
    padding: 12px 16px;
    font-size: 14px;
    font-weight: 500;
    line-height: 1.7;
    color: #3f3f3f;
    background: #fafafa;
    border: 1px solid #f0f0f0;
    border-radius: 4px;
  }
}
</style>
