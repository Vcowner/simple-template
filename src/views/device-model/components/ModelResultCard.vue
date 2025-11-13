<!--
 * @Author: liaokt
 * @Description: 模型结果卡片
 * @Date: 2025-11-13 21:40:00
 * @LastEditors: liaokt
 * @LastEditTime: 2025-11-13 21:40:00
-->
<template>
  <a-card :bordered="false" class="model-result-card">
    <template #title>
      <div class="model-result-card__header">
        <h3 class="model-result-card__title">
          <BranchesOutlined />
          模型结果
        </h3>
      </div>
    </template>

    <section class="model-result-card__status">
      <div class="model-result-card__status-label">训练状态</div>
      <a-tag :color="statusTag.color">{{ statusTag.text }}</a-tag>
    </section>

    <section v-if="status === 'completed'" class="model-result-card__metrics">
      <div class="metric-item">
        <div class="metric-item__label">准确率</div>
        <div class="metric-item__value">{{ formatMetric(metrics.accuracy) }}</div>
      </div>
      <div class="metric-item">
        <div class="metric-item__label">召回率</div>
        <div class="metric-item__value">{{ formatMetric(metrics.recall) }}</div>
      </div>
      <div class="metric-item">
        <div class="metric-item__label">F1值</div>
        <div class="metric-item__value">{{ formatMetric(metrics.f1) }}</div>
      </div>
    </section>

    <a-button
      v-if="status === 'completed'"
      type="primary"
      block
      :disabled="saveDisabled"
      :loading="saving"
      @click="$emit('save')"
    >
      <SaveOutlined />
      保存模型参数
    </a-button>
  </a-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PropType } from 'vue'
import { BranchesOutlined, SaveOutlined } from '@ant-design/icons-vue'

type TrainingStatus = 'idle' | 'training' | 'completed'

const props = defineProps({
  status: {
    type: String as PropType<TrainingStatus>,
    default: 'idle'
  },
  metrics: {
    type: Object as PropType<{
      accuracy?: number | null
      recall?: number | null
      f1?: number | null
    }>,
    default: () => ({})
  },
  saveDisabled: {
    type: Boolean,
    default: true
  },
  saving: {
    type: Boolean,
    default: false
  }
})

defineEmits(['save'])

const statusTagMap: Record<TrainingStatus, { text: string; color: string }> = {
  idle: { text: '待训练', color: 'default' },
  training: { text: '训练中', color: 'processing' },
  completed: { text: '训练完成', color: 'success' }
}

const statusTag = computed(() => statusTagMap[props.status] ?? statusTagMap.idle)

const formatMetric = (value?: number | null) => {
  if (value === undefined || value === null) return '--'
  return `${(value * 100).toFixed(1)}%`
}
</script>

<style scoped lang="scss">
.model-result-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.model-result-card__title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.model-result-card__status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.model-result-card__status-label {
  font-weight: 500;
}

.model-result-card__metrics {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;

  .metric-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #f7f9fc;
    border-radius: 8px;
    padding: 12px 16px;

    &__label {
      color: #6f6f6f;
      font-weight: 500;
    }

    &__value {
      font-size: 20px;
      font-weight: 600;
      color: #0f2643;
    }
  }
}
</style>
<!-- EOF -->
