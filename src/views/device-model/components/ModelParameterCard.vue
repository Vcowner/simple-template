<!--
 * @Author: liaokt
 * @Description: 模型参数配置卡片
 * @Date: 2025-11-13 21:40:00
 * @LastEditors: liaokt
 * @LastEditTime: 2025-11-13 21:58:29
-->
<template>
  <a-card :bordered="false" class="model-parameter-card">
    <template #title>
      <div class="model-parameter-card__header">
        <h3 class="model-parameter-card__title">
          <SettingOutlined />
          模型参数配置
        </h3>
      </div>
    </template>

    <a-form layout="vertical" class="model-parameter-card__form">
      <a-form-item label="模型类型">
        <a-select
          :value="modelType"
          :options="modelTypeOptions"
          :disabled="disabled"
          @change="handleModelTypeChange"
        />
      </a-form-item>

      <a-form-item label="训练迭代次数">
        <a-select
          :value="iterations"
          :options="iterationOptions"
          :disabled="disabled"
          @change="handleIterationsChange"
        />
      </a-form-item>

      <a-form-item label="训练集占比">
        <a-select
          :value="trainSplit"
          :options="trainSplitOptions"
          :disabled="disabled"
          @change="handleTrainSplitChange"
        />
      </a-form-item>
    </a-form>

    <!-- 训练进度区域 -->
    <div v-if="training" class="model-parameter-card__progress">
      <div class="model-parameter-card__progress-status">
        <a-spin size="small" />
        <span>训练中...</span>
      </div>
      <div class="model-parameter-card__progress-bar">
        <div class="model-parameter-card__progress-label">
          <span>训练进度</span>
          <span class="model-parameter-card__progress-value">{{ formattedProgress }}%</span>
        </div>
        <a-progress :percent="trainingProgress" :show-info="false" />
      </div>
    </div>

    <a-button
      type="primary"
      block
      :disabled="disabled || startDisabled"
      :loading="loading"
      @click="$emit('start')"
    >
      <PlayCircleOutlined />
      开始模型训练
    </a-button>
  </a-card>
</template>

<script setup lang="ts">
import { toRefs, computed } from 'vue'
import type { PropType } from 'vue'
import { SettingOutlined, PlayCircleOutlined } from '@ant-design/icons-vue'

const props = defineProps({
  modelType: {
    type: String,
    default: 'random_forest'
  },
  iterations: {
    type: Number,
    default: 100
  },
  trainSplit: {
    type: Number,
    default: 0.8
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  startDisabled: {
    type: Boolean,
    default: false
  },
  modelTypeOptions: {
    type: Array as PropType<Array<{ label: string; value: string }>>,
    default: () => []
  },
  iterationOptions: {
    type: Array as PropType<Array<{ label: string; value: number }>>,
    default: () => []
  },
  trainSplitOptions: {
    type: Array as PropType<Array<{ label: string; value: number }>>,
    default: () => []
  },
  training: {
    type: Boolean,
    default: false
  },
  trainingProgress: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits<{
  (e: 'update:modelType', value: string): void
  (e: 'update:iterations', value: number): void
  (e: 'update:trainSplit', value: number): void
  (e: 'start'): void
}>()

const {
  modelType,
  iterations,
  trainSplit,
  modelTypeOptions,
  iterationOptions,
  trainSplitOptions,
  disabled,
  loading,
  startDisabled,
  training,
  trainingProgress
} = toRefs(props)

const handleModelTypeChange = (value: string) => {
  emit('update:modelType', value)
}

const handleIterationsChange = (value: number) => {
  emit('update:iterations', value)
}

const handleTrainSplitChange = (value: number) => {
  emit('update:trainSplit', value)
}

const formattedProgress = computed(() => {
  return trainingProgress.value.toFixed(1)
})
</script>

<style scoped lang="scss">
.model-parameter-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.model-parameter-card__title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.model-parameter-card__form {
  margin-bottom: 24px;
}

.model-parameter-card__progress {
  background: #f7f9fc;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}

.model-parameter-card__progress-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.model-parameter-card__progress-percent {
  font-size: 16px;
  font-weight: 600;
  color: #0f2643;
}

.model-parameter-card__progress-icon {
  color: #8c8c8c;
  font-size: 12px;
}

.model-parameter-card__progress-status {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #ffffff;
  border-radius: 4px;
  padding: 12px;
  margin-bottom: 16px;
  color: #0f2643;
  font-size: 14px;
}

.model-parameter-card__progress-bar {
  .model-parameter-card__progress-label {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
    font-size: 14px;
    color: #0f2643;
  }

  .model-parameter-card__progress-value {
    font-weight: 600;
    color: #0f2643;
  }

  :deep(.ant-progress-bg) {
    background-color: #1890ff;
  }
}
</style>
