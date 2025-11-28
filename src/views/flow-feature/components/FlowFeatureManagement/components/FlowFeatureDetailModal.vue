<!--
 * @Author: liaokt
 * @Description: 流级特征详情弹窗
 * @Date: 2025-11-13 20:55:00
 * @LastEditors: liaokt
 * @LastEditTime: 2025-11-27 09:42:15
-->
<template>
  <MxDetailModal
    :modal="modal"
    :fields="detailFields"
    :data="detailData"
    :body-loading="detailLoading"
    custom-class="flow-feature-detail-modal"
    :show-ok="false"
    :show-cancel="false"
  >
    <template #value-tcp_flags_list="{ data }">
      <div
        v-if="
          data.tcp_flags_list &&
          Array.isArray(data.tcp_flags_list) &&
          data.tcp_flags_list.length > 0
        "
        class="tcp-flags"
      >
        <a-tag v-for="flag in data.tcp_flags_list" :key="flag" color="blue">{{ flag }}</a-tag>
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
import { computed, watch, nextTick } from 'vue'
import { toRaw } from 'vue'
import { MxDetailModal, useModal, type UseModalReturn } from '@/components/MxModal'
import type { DetailFieldOrGroup } from '@/components/MxModal/MxDetailModal.vue'
import { useRequest } from '@/hooks/useRequest'
import { getFlowFeatureDetail } from '@/api/flow-features'
import { formatTime } from '@/utils/time/time'

defineOptions({
  name: 'FlowFeatureDetailModal'
})

interface Props {
  modal?: UseModalReturn
}

const props = defineProps<Props>()

const modal = props.modal || useModal()

const {
  run: runGetDetail,
  data: detailResponse,
  loading: detailLoading
} = useRequest(getFlowFeatureDetail, {
  manual: true,
  showMessage: false
})

const detailData = computed<Record<string, any>>(() => {
  return (
    (detailResponse.value as any)?.data ?? (modal.args.value?.data as Record<string, any>) ?? {}
  )
})

// 使用标志位防止重复调用
let isFetching = false

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
          try {
            runGetDetail({ id: args.id }).finally(() => {
              isFetching = false
            })
          } catch (error) {
            console.error('获取详情失败:', error)
            isFetching = false
          }
        } else {
          isFetching = false
        }
      })
    } else if (!visible) {
      // 弹窗关闭时重置标志位
      isFetching = false
    }
  },
  { immediate: true } // 使用 immediate: true，但通过标志位防止重复调用
)

const detailFields = computed<DetailFieldOrGroup[]>(() => [
  {
    fields: [
      { key: 'feature_id', label: '特征ID' },
      { key: 'data_flow_length', label: '数据流长度(KB)' },
      { key: 'duration', label: '持续时间(s)' },
      { key: 'tcp_flags_list', label: 'TCP标记' },
      {
        key: 'ip_version_display',
        label: 'IP协议版本',
        type: 'tag',
        tagColor: 'default'
      }
    ]
  },
  {
    fields: [
      { key: 'related_rule_name', label: '关联规则', span: 24 },
      {
        key: 'created_at',
        label: '创建时间',
        span: 24,
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
.flow-feature-detail-modal__footer {
  display: flex;
  justify-content: flex-end;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.tcp-flags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
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
