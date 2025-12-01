<!--
 * @Author: liaokt
 * @Description: 已选择特征概览卡片
 * @Date: 2025-11-13 21:40:00
 * @LastEditors: liaokt
 * @LastEditTime: 2025-11-13 21:40:00
-->
<template>
  <a-card :bordered="false" class="selected-feature-overview">
    <template #title>
      <h3 class="selected-feature-overview__title">已选择特征概览</h3>
    </template>

    <div class="selected-feature-overview__content">
      <div class="feature-group">
        <div class="feature-group__label">包级特征</div>
        <div class="feature-group__chips">
          <a-tag v-for="item in packetTags" :key="item.value" color="blue">{{ item.label }}</a-tag>
          <span v-if="packetTags.length === 0" class="feature-group__empty">暂无选择</span>
        </div>
      </div>

      <div class="feature-group">
        <div class="feature-group__label">流级特征</div>
        <div class="feature-group__chips">
          <a-tag v-for="item in flowTags" :key="item.value" color="blue">{{ item.label }}</a-tag>
          <span v-if="flowTags.length === 0" class="feature-group__empty">暂无选择</span>
        </div>
      </div>
    </div>
  </a-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PropType } from 'vue'

interface FeatureOption {
  label: string
  value: string
}

const props = defineProps({
  packetFeatures: {
    type: Array as PropType<FeatureOption[]>,
    default: () => []
  },
  flowFeatures: {
    type: Array as PropType<FeatureOption[]>,
    default: () => []
  },
  packetSelection: {
    type: Array as PropType<string[]>,
    default: () => []
  },
  flowSelection: {
    type: Array as PropType<string[]>,
    default: () => []
  }
})

const packetTags = computed(() =>
  props.packetFeatures.filter(item => props.packetSelection.includes(item.value))
)

const flowTags = computed(() =>
  props.flowFeatures.filter(item => props.flowSelection.includes(item.value))
)
</script>

<style scoped lang="scss">
.selected-feature-overview__title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.selected-feature-overview__content {
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
}

.feature-group {
  flex: 1;
  min-width: 240px;
}

.feature-group__label {
  margin-bottom: 12px;
  font-weight: 600;
  color: #0f2643;
}

.feature-group__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.feature-group__empty {
  color: #8c8c8c;
}
</style>
