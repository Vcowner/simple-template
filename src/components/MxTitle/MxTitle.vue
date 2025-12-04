<!--
 * @Author: liaokt
 * @Description: 标题组件，带方形柱装饰
 * @Date: 2025-12-04
-->
<template>
  <div
    :class="[
      'mx-title',
      `mx-title--${size}`,
      `mx-title--${barPosition}`,
      { 'mx-title--has-body': hasDefaultSlot },
      customClass
    ]"
  >
    <!-- 标题头部 -->
    <div v-if="hasHeader" class="mx-title__header">
      <div :class="['mx-title__bar', `mx-title__bar--${barPosition}`]" :style="barStyle"></div>
      <div class="mx-title__header-content" :style="headerContentStyle">
        <slot name="header">
          {{ title }}
        </slot>
      </div>
    </div>

    <!-- 子内容 -->
    <div v-if="hasDefaultSlot" class="mx-title__body">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { useThemeStore } from '@/store/theme'

/**
 * MxTitle 标题组件
 * 带方形柱装饰的标题组件，可作为容器包裹子内容
 *
 * @example
 * ```vue
 * <!-- 基础用法 -->
 * <mx-title title="用户管理" />
 *
 * <!-- 作为容器使用 -->
 * <mx-title title="预设主题">
 *   <PresetTheme />
 * </mx-title>
 *
 * <!-- 自定义颜色 -->
 * <mx-title title="数据统计" :color="#1890ff">
 *   <div>内容</div>
 * </mx-title>
 *
 * <!-- 使用插槽自定义标题 -->
 * <mx-title>
 *   <template #header>
 *     <span>自定义标题</span>
 *   </template>
 *   <div>内容</div>
 * </mx-title>
 * ```
 */
defineOptions({
  name: 'MxTitle'
})

interface Props {
  /** 标题文本 */
  title?: string
  /** 尺寸大小 */
  size?: 'large' | 'middle' | 'small'
  /** 方形柱颜色，默认使用主题色 */
  color?: string
  /** 方形柱宽度 */
  barWidth?: number
  /** 方形柱位置 */
  barPosition?: 'left' | 'top'
  /** 自定义类名 */
  customClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  size: 'middle',
  color: undefined,
  barWidth: undefined,
  barPosition: 'left',
  customClass: ''
})

const slots = useSlots()
const themeStore = useThemeStore()

/** 是否有标题内容 */
const hasHeader = computed(() => {
  return !!(props.title || slots.header)
})

/** 是否有默认插槽内容 */
const hasDefaultSlot = computed(() => {
  return !!slots.default
})

/** 方形柱样式 */
const barStyle = computed(() => {
  const style: Record<string, string> = {}

  // 颜色：优先使用传入的颜色，否则使用主题色
  const color = props.color || themeStore.themeConfig.token?.colorPrimary || '#2f54eb'
  style.backgroundColor = typeof color === 'string' ? color : '#2f54eb'

  // 宽度：如果指定了宽度，使用指定值
  if (props.barWidth !== undefined) {
    if (props.barPosition === 'left') {
      style.width = `${props.barWidth}px`
    } else {
      style.height = `${props.barWidth}px`
    }
  }

  return style
})

/** 标题内容样式 - 根据主题动态设置颜色 */
const headerContentStyle = computed(() => {
  const isDark = themeStore.themeMode === 'dark'
  return {
    color: isDark ? 'rgb(255 255 255 / 85%)' : 'rgb(0 0 0 / 85%)'
  }
})
</script>

<style lang="scss" scoped>
.mx-title {
  position: relative;
  display: flex;
  flex-direction: column;

  &__header {
    position: relative;
    display: flex;

    .mx-title--left & {
      flex-direction: row;
      align-items: center;
    }

    .mx-title--top & {
      flex-direction: column;
      align-items: flex-start;
    }
  }

  &__bar {
    flex-shrink: 0;
    background-color: #2f54eb;
    border-radius: 2px;
    transition: background-color 0.3s;

    &--left {
      align-self: center;
      width: 3px;
      height: 14px;
      margin-right: 8px;
    }

    &--top {
      width: 100%;
      height: 3px;
      margin-bottom: 12px;
      border-radius: 2px;
    }
  }

  &__header-content {
    flex: 1;
    font-weight: 500;
    transition: color 0.3s ease;
  }

  &__body {
    flex: 1;
  }

  // 大尺寸
  &--large {
    .mx-title__bar {
      &--left {
        width: 3px;
        height: 16px;
        margin-right: 10px;
        border-radius: 2px;
      }

      &--top {
        height: 3px;
        margin-bottom: 14px;
        border-radius: 2px;
      }
    }

    .mx-title__header-content {
      font-size: 16px;
      line-height: 24px;
    }
  }

  // 中等尺寸（默认）
  &--middle {
    .mx-title__bar {
      &--left {
        width: 3px;
        height: 14px;
        margin-right: 8px;
        border-radius: 2px;
      }

      &--top {
        height: 3px;
        margin-bottom: 12px;
        border-radius: 2px;
      }
    }

    .mx-title__header-content {
      font-size: 14px;
      line-height: 22px;
    }
  }

  // 小尺寸
  &--small {
    .mx-title__bar {
      &--left {
        width: 2px;
        height: 12px;
        margin-right: 6px;
        border-radius: 2px;
      }

      &--top {
        height: 2px;
        margin-bottom: 8px;
        border-radius: 2px;
      }
    }

    .mx-title__header-content {
      font-size: 13px;
      line-height: 20px;
    }
  }
}
</style>
