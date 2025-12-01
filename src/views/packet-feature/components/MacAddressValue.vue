<!--
 * @Author: liaokt
 * @Description: MAC 地址展示组件
 * @Date: 2025-11-13 17:20:00
 * @LastEditors: liaokt
 * @LastEditTime: 2025-11-13 17:20:00
-->
<template>
  <span :class="['mac-address-value', { 'mac-address-value--empty': isEmpty }]">
    {{ isEmpty ? placeholder : displayValue }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { DetailField } from '@/components/MxModal/MxDetailModal.vue'

interface Props {
  value?: string
  placeholder?: string
  field: DetailField
}

const props = withDefaults(defineProps<Props>(), {
  value: '',
  placeholder: '-'
})

const isEmpty = computed(() => {
  return props.value === null || props.value === undefined || String(props.value).trim() === ''
})

const displayValue = computed(() => {
  return String(props.value ?? '')
})
</script>

<style scoped lang="scss">
.mac-address-value {
  display: inline-block;
  padding: 4px 10px;
  font-family: SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 14px;
  color: #3f3f3f;
  letter-spacing: 0.6px;
  background: #f7f7fa;
  border: 1px solid #ebeaf5;
  border-radius: 4px;

  &--empty {
    padding-left: 0;
    font-family: inherit;
    background: transparent;
    border-color: transparent;
  }
}
</style>
