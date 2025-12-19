<!--
 * @Author: liaokt
 * @Description: 指标卡片组件，用于展示数据指标和对比信息
 * @Date: 2025-12-15
-->
<template>
  <div :class="['mx-metric-card', customClass]" @click="handleClick">
    <!-- 标题区域 -->
    <div class="mx-metric-card__header">
      <span class="mx-metric-card__title">{{ title }}</span>
      <component
        v-if="showInfoIcon"
        :is="infoIcon"
        class="mx-metric-card__info-icon"
        @click.stop="emit('infoClick')"
      />
    </div>

    <!-- 主要数值 -->
    <div class="mx-metric-card__value">
      <slot name="value">
        <span v-if="prefix" class="mx-metric-card__prefix">{{ prefix }}</span>
        <span class="mx-metric-card__value-number">{{ formattedValue }}</span>
        <span v-if="suffix" class="mx-metric-card__suffix">{{ suffix }}</span>
      </slot>
    </div>

    <!-- 对比指标 -->
    <div v-if="comparisons && comparisons.length > 0" class="mx-metric-card__comparisons">
      <div v-for="(item, index) in comparisons" :key="index" class="mx-metric-card__comparison">
        <span class="mx-metric-card__comparison-label">{{ item.label }}</span>
        <span class="mx-metric-card__comparison-value" :style="getComparisonItemStyle(item)">
          {{ formatComparisonValue(item.value, item.trend) }}
        </span>
        <span
          :class="['mx-metric-card__trend-icon', `mx-metric-card__trend-icon--${item.trend}`]"
          :style="getComparisonItemStyle(item)"
        >
          {{ item.trend === 'up' ? '▲' : '▼' }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { InfoCircleOutlined } from '@ant-design/icons-vue'
import type {
  MxMetricCardProps,
  MxMetricCardEmits,
  ComparisonItem,
  TrendType
} from './metricCardTypes'

/**
 * MxMetricCard 指标卡片组件
 * 用于展示数据指标和对比信息，支持趋势显示
 *
 * @example
 * ```vue
 * <!-- 基础用法 -->
 * <mx-metric-card title="总销售额" :value="126560" prefix="¥" />
 *
 * <!-- 带对比指标 -->
 * <mx-metric-card
 *   title="总销售额"
 *   :value="126560"
 *   prefix="¥"
 *   :comparisons="[
 *     { label: '周同比', value: 12, trend: 'up' },
 *     { label: '日同比', value: 11, trend: 'down' }
 *   ]"
 * />
 *
 * <!-- 带信息图标 -->
 * <mx-metric-card
 *   title="总销售额"
 *   :value="126560"
 *   prefix="¥"
 *   show-info-icon
 *   @info-click="handleInfoClick"
 * />
 *
 * <!-- 自定义图标 -->
 * <mx-metric-card
 *   title="总销售额"
 *   :value="126560"
 *   prefix="¥"
 *   show-info-icon
 *   :icon="QuestionCircleOutlined"
 *   @info-click="handleInfoClick"
 * />
 *
 * <!-- 使用 slot 自定义数值区域 -->
 * <mx-metric-card title="自定义数值">
 *   <template #value>
 *     <span>自定义内容</span>
 *   </template>
 * </mx-metric-card>
 * ```
 */
defineOptions({
  name: 'MxMetricCard'
})

const props = withDefaults(defineProps<MxMetricCardProps>(), {
  title: '',
  value: 0,
  prefix: '',
  suffix: '',
  showInfoIcon: false,
  icon: undefined,
  comparisons: () => [],
  customClass: ''
})

const emit = defineEmits<MxMetricCardEmits>()

/** 信息图标组件 */
const infoIcon = computed(() => {
  return props.icon || InfoCircleOutlined
})

/** 格式化后的数值 */
const formattedValue = computed(() => {
  if (typeof props.value === 'number') {
    // 如果是数字，添加千分位分隔符
    return props.value.toLocaleString('zh-CN')
  }
  return props.value
})

/** 格式化对比值 */
const formatComparisonValue = (value: number | string, trend?: TrendType): string => {
  if (typeof value === 'number') {
    const sign = trend === 'up' ? '+' : '-'
    return `${sign}${value}%`
  }
  return String(value)
}

/** 获取对比项的颜色样式（用于数值和图标） */
const getComparisonItemStyle = (item: ComparisonItem) => {
  const style: Record<string, string> = {}

  if (item.color) {
    // 如果指定了颜色，使用指定颜色
    style.color = item.color
  } else {
    // 否则使用默认颜色：上升红色，下降绿色
    style.color = item.trend === 'up' ? '#ff4d4f' : '#52c41a'
  }

  return style
}

/** 处理卡片点击 */
const handleClick = () => {
  emit('click')
}
</script>

<style lang="scss" scoped>
.mx-metric-card {
  position: relative;
  padding: 20px 24px;
  cursor: pointer;
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgb(0 0 0 / 4%);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 12px rgb(0 0 0 / 8%);
    transform: translateY(-2px);
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
  }

  &__title {
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
    color: rgb(0 0 0 / 65%);
  }

  &__info-icon {
    font-size: 14px;
    color: rgb(0 0 0 / 65%);
    cursor: pointer;
    transition: color 0.3s ease;

    &:hover {
      color: rgb(0 0 0 / 85%);
    }
  }

  &__value {
    display: flex;
    align-items: baseline;
    margin-bottom: 16px;
    line-height: 1;
  }

  &__prefix {
    margin-right: 4px;
    font-size: 20px;
    font-weight: 500;
    color: rgb(0 0 0 / 85%);
  }

  &__value-number {
    font-size: 30px;
    font-weight: 600;
    line-height: 1;
    color: rgb(0 0 0 / 85%);
  }

  &__suffix {
    margin-left: 4px;
    font-size: 20px;
    font-weight: 500;
    color: rgb(0 0 0 / 85%);
  }

  &__comparisons {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__comparison {
    display: flex;
    align-items: center;
    font-size: 14px;
    line-height: 22px;
    transition: color 0.3s ease;
  }

  &__comparison-label {
    margin-right: 8px;
    color: rgb(0 0 0 / 65%);
  }

  &__comparison-value {
    margin-right: 4px;
    font-weight: 500;
  }

  &__trend-icon {
    font-size: 12px;
    font-weight: 500;
    line-height: 1;
  }
}

// 暗色主题适配
[data-theme='dark'] {
  .mx-metric-card {
    background: rgb(255 255 255 / 4%);
    border-color: rgb(255 255 255 / 10%);

    &__title {
      color: rgb(255 255 255 / 65%);
    }

    &__info-icon {
      color: rgb(255 255 255 / 65%);

      &:hover {
        color: rgb(255 255 255 / 85%);
      }
    }

    &__prefix,
    &__value-number,
    &__suffix {
      color: rgb(255 255 255 / 85%);
    }

    &__comparison-label {
      color: rgb(255 255 255 / 65%);
    }
  }
}
</style>
