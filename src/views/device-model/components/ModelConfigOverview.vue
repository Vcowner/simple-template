<!--
 * @Author: liaokt
 * @Description: 模型配置概览
 * @Date: 2025-11-13 21:40:00
 * @LastEditors: liaokt
 * @LastEditTime: 2025-11-13 21:40:00
-->
<template>
  <a-card :bordered="false" class="model-config-overview">
    <template #title>
      <h3 class="model-config-overview__title">模型配置概览</h3>
    </template>

    <div class="model-config-overview__content">
      <div class="config-item">
        <div class="config-item__label">模型类型</div>
        <div class="config-item__value">{{ modelTypeLabel }}</div>
      </div>
      <div class="config-item">
        <div class="config-item__label">训练迭代次数</div>
        <div class="config-item__value">{{ params.iterations }}</div>
      </div>
      <div class="config-item">
        <div class="config-item__label">训练集占比</div>
        <div class="config-item__value">{{ (params.trainSplit * 100).toFixed(0) }}%</div>
      </div>
    </div>
  </a-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PropType } from 'vue'

interface ModelOverviewParams {
  modelType: string
  iterations: number
  trainSplit: number
}

const props = defineProps({
  params: {
    type: Object as PropType<ModelOverviewParams>,
    required: true
  },
  modelTypeOptions: {
    type: Array as PropType<Array<{ label: string; value: string }>>,
    default: () => []
  }
})

const modelTypeLabel = computed(() => {
  const match = props.modelTypeOptions.find(option => option.value === props.params.modelType)
  return match ? match.label : props.params.modelType
})
</script>

<style scoped lang="scss">
.model-config-overview__title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.model-config-overview__content {
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
}

.config-item {
  flex: 1;
  min-width: 200px;

  &__label {
    margin-bottom: 4px;
    font-size: 12px;
    color: #8c8c8c;
  }

  &__value {
    font-size: 16px;
    font-weight: 600;
    color: #0f2643;
  }
}
</style>
