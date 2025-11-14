<!--
 * @Author: liaokt
 * @Description: 流级特征详情弹窗
 * @Date: 2025-11-13 20:55:00
 * @LastEditors: liaokt
 * @LastEditTime: 2025-11-13 20:55:00
-->
<template>
  <MxDetailModal
    :modal="modal"
    :fields="detailFields"
    custom-class="flow-feature-detail-modal"
    :show-ok="false"
    :show-cancel="false"
  >
    <template #value-tcpFlags="{ data }">
      <div
        v-if="data.tcpFlags && Array.isArray(data.tcpFlags) && data.tcpFlags.length > 0"
        class="tcp-flags"
      >
        <a-tag v-for="flag in data.tcpFlags" :key="flag" color="blue">{{ flag }}</a-tag>
      </div>
      <span v-else>-</span>
    </template>

    <template #value-associatedRule="{ data }">
      <div v-if="data.associatedRuleName && data.associatedRuleId" class="associated-rule">
        <div class="associated-rule__name">{{ data.associatedRuleName }}</div>
        <div class="associated-rule__id">{{ data.associatedRuleId }}</div>
      </div>
      <span v-else>-</span>
    </template>

    <template #footer>
      <div class="flow-feature-detail-modal__footer">
        <a-button type="primary" @click="handleClose">关闭</a-button>
      </div>
    </template>
  </MxDetailModal>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { MxDetailModal, useModal, type UseModalReturn } from '@/components/MxModal'
import type { DetailFieldOrGroup } from '@/components/MxModal/MxDetailModal.vue'

defineOptions({
  name: 'FlowFeatureDetailModal'
})

interface Props {
  modal?: UseModalReturn
}

const props = defineProps<Props>()

const modal = props.modal || useModal()

const detailFields = computed<DetailFieldOrGroup[]>(() => [
  {
    fields: [
      { key: 'featureId', label: '特征ID' },
      { key: 'dataFlowLength', label: '数据流长度(KB)' },
      { key: 'duration', label: '持续时间(s)' },
      { key: 'tcpFlags', label: 'TCP标记' },
      { key: 'ipProtocolVersion', label: 'IP协议版本', type: 'tag', tagColor: 'default' }
    ]
  },
  {
    fields: [{ key: 'associatedRule', label: '关联规则', span: 24 }]
  }
])

const handleClose = () => {
  modal.hide()
}
</script>

<style scoped lang="scss">
.flow-feature-detail-modal__footer {
  display: flex;
  justify-content: flex-end;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.tcp-flags {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.associated-rule {
  &__name {
    margin-bottom: 4px;
    font-size: 14px;
    font-weight: 500;
    color: #1f1f1f;
  }

  &__id {
    font-size: 12px;
    color: #8c8c8c;
  }
}
</style>
