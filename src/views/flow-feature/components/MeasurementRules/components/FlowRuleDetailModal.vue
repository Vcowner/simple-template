<!--
 * @Author: liaokt
 * @Description: 数据流测量规则详情弹窗
 * @Date: 2025-11-13 19:25:00
 * @LastEditors: liaokt
 * @LastEditTime: 2025-11-27 09:17:22
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
import type { DetailFieldOrGroup } from '@/components/MxModal/MxDetailModal.vue'
import { FLOW_RULE_METRIC_DICT } from '../../../dictkey'
import { formatTime } from '@/utils/time/time'

defineOptions({
  name: 'FlowRuleDetailModal'
})

interface Props {
  modal?: UseModalReturn
}

const props = defineProps<Props>()

const modal = props.modal || useModal()

const detailFields = computed<DetailFieldOrGroup[]>(() => [
  {
    // 不设置 title 或设置为 undefined，则不显示标题
    fields: [
      { key: 'rule_id', label: '规则ID' },
      { key: 'rule_name', label: '规则名称' },
      {
        key: 'measure_length',
        label: '测量维度',
        type: 'tag',
        formatter: (value: unknown) =>
          (FLOW_RULE_METRIC_DICT[value as keyof typeof FLOW_RULE_METRIC_DICT] ||
            String(value)) as string
      },
      { key: 'threshold_range', label: '阈值范围' },
      {
        key: 'created_at',
        label: '创建时间',
        formatter: (value: unknown) => (value ? formatTime(value as string) : '-')
      }
    ]
  }
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
