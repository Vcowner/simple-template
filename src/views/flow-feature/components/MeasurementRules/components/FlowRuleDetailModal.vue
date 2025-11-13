<!--
 * @Author: liaokt
 * @Description: 数据流测量规则详情弹窗
 * @Date: 2025-11-13 19:25:00
 * @LastEditors: liaokt
 * @LastEditTime: 2025-11-13 19:25:00
-->
<template>
  <MxDetailModal
    :modal="modal"
    :fields="detailFields"
    custom-class="flow-rule-detail-modal"
    :show-ok="false"
    :show-cancel="false"
  >
    <template #footer>
      <div class="flow-rule-detail-modal__footer">
        <a-button type="primary" @click="handleClose">关闭</a-button>
      </div>
    </template>
  </MxDetailModal>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { MxDetailModal, useModal, type UseModalReturn } from '@/components/MxModal'
import type { DetailField } from '@/components/MxModal/MxDetailModal.vue'

defineOptions({
  name: 'FlowRuleDetailModal'
})

interface Props {
  modal?: UseModalReturn
}

const props = defineProps<Props>()

const modal = props.modal || useModal()

const detailFields = computed<DetailField[]>(() => [
  { key: 'ruleId', label: '规则ID' },
  { key: 'ruleName', label: '规则名称' },
  { key: 'metricDimension', label: '测量维度', type: 'tag' },
  { key: 'thresholdRange', label: '阈值范围' },
  { key: 'createdAt', label: '创建时间' }
])

const handleClose = () => {
  modal.hide()
}
</script>

<style scoped lang="scss">
.flow-rule-detail-modal__footer {
  display: flex;
  justify-content: flex-end;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}
</style>
