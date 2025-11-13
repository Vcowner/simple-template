<!--
 * @Author: liaokt
 * @Description: 特征详情弹窗组件
 * @Date: 2025-11-13 16:00:00
 * @LastEditors: liaokt
 * @LastEditTime: 2025-11-13 16:59:11
-->
<template>
  <MxDetailModal
    :modal="modal"
    :fields="detailFields"
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
import { useModal, type UseModalReturn, MxDetailModal } from '@/components/MxModal'
import type { DetailField } from '@/components/MxModal/MxDetailModal.vue'
import MacAddressValue from './MacAddressValue.vue'

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

const detailFields = computed<DetailField[]>(() => [
  {
    key: 'featureId',
    label: '特征ID'
  },
  {
    key: 'deviceType',
    label: '设备类型',
    type: 'tag'
  },
  {
    key: 'packetSize',
    label: '数据包大小',
    suffix: ' KB'
  },
  {
    key: 'tcpWindow',
    label: 'TCP窗口大小',
    suffix: ' 字节'
  },
  {
    key: 'port',
    label: '端口号'
  },
  {
    key: 'mac',
    label: 'MAC地址',
    component: MacAddressValue
  },
  {
    key: 'dns',
    label: 'DNS域名字符串',
    span: 24
  },
  {
    key: 'httpStatus',
    label: 'HTTP响应报文',
    type: 'block',
    span: 24
  },
  {
    key: 'createdAt',
    label: '创建时间',
    span: 24
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
    margin-bottom: 24px;
    padding-bottom: 16px;
    color: #8c8c8c;
    font-size: 13px;
    border-bottom: 1px solid #f0f0f0;
  }

  &__footer {
    display: flex;
    justify-content: flex-end;
    padding-top: 16px;
    border-top: 1px solid #f0f0f0;
  }

  :deep(.mx-detail-modal__label) {
    color: #6f6f6f;
    font-size: 13px;
    font-weight: 500;
    line-height: 1.6;
  }

  :deep(.mx-detail-modal__value) {
    color: #1f1f1f;
    font-size: 14px;
    font-weight: 500;
    line-height: 1.6;
    word-break: break-word;
  }

  :deep(.mx-detail-modal__value--tag .ant-tag) {
    margin-inline-end: 0;
    padding: 3px 12px;
    border-radius: 4px;
    font-size: 13px;
    font-weight: 500;
    line-height: 22px;
  }

  :deep(.mx-detail-modal__value--block) {
    display: inline-block;
    padding: 12px 16px;
    background: #fafafa;
    border: 1px solid #f0f0f0;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 500;
    color: #3f3f3f;
    line-height: 1.7;
  }
}
</style>
