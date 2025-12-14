<!--
 * @Author: liaokt
 * @Description: 响应式容器组件，宽度和高度自适应父容器
 * @Date: 2025-12-05
-->
<template>
  <div :class="['mx-responsive-container', customClass]" :style="containerStyle">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useThemeStore } from '@/store/modules/theme'
import type { MxResponsiveContainerProps } from './responsiveContainerTypes'

/**
 * MxResponsiveContainer 响应式容器组件
 * 宽度和高度自适应父容器，支持滚动、Flex 布局等配置
 *
 * @example
 * ```vue
 * <!-- 基础用法 -->
 * <MxResponsiveContainer>
 *   <div>内容</div>
 * </MxResponsiveContainer>
 *
 * <!-- 带内边距和滚动 -->
 * <MxResponsiveContainer :padding="24" scrollable>
 *   <div>可滚动内容</div>
 * </MxResponsiveContainer>
 *
 * <!-- Flex 布局 -->
 * <MxResponsiveContainer flex flex-direction="column" :justify-content="'space-between'">
 *   <div>顶部内容</div>
 *   <div>底部内容</div>
 * </MxResponsiveContainer>
 * ```
 */
defineOptions({
  name: 'MxResponsiveContainer'
})

const props = withDefaults(defineProps<MxResponsiveContainerProps>(), {
  padding: undefined,
  scrollable: false,
  scrollDirection: 'both',
  backgroundColor: undefined,
  customClass: '',
  flexDirection: 'column',
  alignItems: 'stretch',
  justifyContent: 'flex-start',
  flex: false,
  minWidth: undefined,
  minHeight: undefined,
  maxWidth: undefined,
  maxHeight: undefined
})

const themeStore = useThemeStore()

// 计算容器样式
const containerStyle = computed(() => {
  const style: Record<string, string> = {
    width: '100%',
    height: '100%'
  }

  // 内边距
  if (props.padding !== undefined) {
    const paddingValue = typeof props.padding === 'number' ? `${props.padding}px` : props.padding
    style.padding = paddingValue
  }

  // 背景色：如果指定了则使用指定值，否则浅色主题使用 #fff，暗色主题不设置
  if (props.backgroundColor) {
    style.backgroundColor = props.backgroundColor
  } else if (!themeStore.isDark) {
    // 浅色主题使用白色背景
    style.backgroundColor = '#fff'
  }

  // Flex 布局
  if (props.flex) {
    style.display = 'flex'
    style.flexDirection = props.flexDirection
    style.alignItems = props.alignItems
    style.justifyContent = props.justifyContent
  }

  // 滚动处理
  if (props.scrollable) {
    switch (props.scrollDirection) {
      case 'x':
        style.overflowX = 'auto'
        style.overflowY = 'hidden'
        break
      case 'y':
        style.overflowX = 'hidden'
        style.overflowY = 'auto'
        break
      case 'both':
        style.overflow = 'auto'
        break
      case 'none':
        style.overflow = 'hidden'
        break
    }
  } else {
    style.overflow = 'hidden'
  }

  // 最小/最大尺寸
  if (props.minWidth !== undefined) {
    style.minWidth = typeof props.minWidth === 'number' ? `${props.minWidth}px` : props.minWidth
  }
  if (props.minHeight !== undefined) {
    style.minHeight = typeof props.minHeight === 'number' ? `${props.minHeight}px` : props.minHeight
  }
  if (props.maxWidth !== undefined) {
    style.maxWidth = typeof props.maxWidth === 'number' ? `${props.maxWidth}px` : props.maxWidth
  }
  if (props.maxHeight !== undefined) {
    style.maxHeight = typeof props.maxHeight === 'number' ? `${props.maxHeight}px` : props.maxHeight
  }

  return style
})
</script>

<style lang="scss" scoped>
.mx-responsive-container {
  position: relative;
  box-sizing: border-box;
  transition: background-color 0.3s ease;
}
</style>
