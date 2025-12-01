<!--
 * @Author: liaokt
 * @Description: 特征来源配置卡片
 * @Date: 2025-11-13 21:40:00
 * @LastEditors: liaokt
 * @LastEditTime: 2025-11-28 12:26:54
-->
<template>
  <a-card :bordered="false" class="feature-source-card">
    <template #title>
      <div class="feature-source-card__header">
        <div>
          <h3 class="feature-source-card__title">
            <DatabaseOutlined />
            特征来源配置
          </h3>
        </div>
      </div>
    </template>

    <section class="feature-group">
      <header class="feature-group__header">
        <span>包级特征选择</span>
        <span class="feature-group__count">{{ packetCount }} 项已选</span>
      </header>
      <a-checkbox-group
        :value="packetSelection"
        :disabled="confirmed"
        class="feature-list"
        @change="handlePacketChange"
      >
        <a-checkbox
          v-for="item in packetFeatures"
          :key="item.value"
          :value="item.value"
          :disabled="item.disabled"
        >
          {{ item.label }}
        </a-checkbox>
      </a-checkbox-group>
    </section>

    <section class="feature-group">
      <header class="feature-group__header">
        <span>流级特征选择</span>
        <span class="feature-group__count">{{ flowCount }} 项已选</span>
      </header>
      <a-checkbox-group
        :value="flowSelection"
        :disabled="confirmed"
        class="feature-list"
        @change="handleFlowChange"
      >
        <a-checkbox
          v-for="item in flowFeatures"
          :key="item.value"
          :value="item.value"
          :disabled="item.disabled"
        >
          {{ item.label }}
        </a-checkbox>
      </a-checkbox-group>
    </section>

    <div class="feature-source-card__footer">
      <a-button
        block
        type="primary"
        :disabled="confirmed || packetSelection.length === 0 || flowSelection.length === 0"
        @click="$emit('confirm')"
      >
        <template v-if="confirmed">
          <CheckCircleOutlined />
          <span>特征已确认</span>
        </template>
        <template v-else>特征已确认</template>
      </a-button>
    </div>
  </a-card>
</template>

<script setup lang="ts">
import { toRefs, computed } from 'vue'
import type { PropType } from 'vue'
import type { CheckboxValueType } from 'ant-design-vue/es/checkbox/interface'
import { DatabaseOutlined, CheckCircleOutlined } from '@ant-design/icons-vue'

interface FeatureOption {
  label: string
  value: string
  disabled?: boolean
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
  },
  confirmed: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits<{
  (e: 'update:packetSelection', value: string[]): void
  (e: 'update:flowSelection', value: string[]): void
  (e: 'confirm'): void
}>()

const { packetSelection, flowSelection } = toRefs(props)

const packetCount = computed(() => packetSelection.value.length)
const flowCount = computed(() => flowSelection.value.length)

const handlePacketChange = (value: CheckboxValueType[]) => {
  emit(
    'update:packetSelection',
    value.filter((v): v is string => typeof v === 'string')
  )
}

const handleFlowChange = (value: CheckboxValueType[]) => {
  emit(
    'update:flowSelection',
    value.filter((v): v is string => typeof v === 'string')
  )
}
</script>

<style scoped lang="scss">
.feature-source-card {
  min-height: 100%;

  :deep(.ant-card-head) {
    min-height: 56px;
  }
}

.feature-source-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.feature-source-card__title {
  display: flex;
  gap: 8px;
  align-items: center;
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.feature-group {
  margin-bottom: 24px;

  &:last-of-type {
    margin-bottom: 0;
  }
}

.feature-group__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  font-weight: 500;
}

.feature-group__count {
  font-size: 12px;
  color: #8c8c8c;
}

.feature-list {
  display: flex;
  flex-direction: column;
  gap: 12px;

  :deep(.ant-checkbox-wrapper-disabled) {
    color: #c5c5c5;
  }
}

.feature-source-card__footer {
  display: flex;
  width: 100%;
  margin-top: 24px;
}
</style>
