<!--
 * @Author: liaokt
 * @Description: 抽屉右侧吸附手柄组件（抽屉关闭时在屏幕右侧，打开时吸附在抽屉左侧）
 * @Date: 2025-12-04
-->
<template>
  <div
    id="setting-drawer-handle"
    class="drawer-handle"
    :class="{ 'drawer-handle--open': isOpen }"
    :style="handleStyle"
    @click.stop="handleClick"
  >
    <Transition name="icon-fade" mode="out-in">
      <span :key="isOpen ? 'close' : 'setting'" class="drawer-handle__icon">
        <CloseOutlined v-if="isOpen" />
        <SettingOutlined v-else />
      </span>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { CloseOutlined, SettingOutlined } from '@ant-design/icons-vue'
import { useThemeColor } from '@/hooks'

interface Props {
  /** 抽屉是否打开 */
  open?: boolean
  /** 抽屉宽度（单位：px），用于计算手柄位置 */
  drawerWidth?: number | string
  /** 抽屉组件引用，用于获取实际 DOM 位置 */
  drawerRef?: any
}

interface Emits {
  (e: 'click'): void
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
  drawerWidth: 400,
  drawerRef: null
})

const emit = defineEmits<Emits>()

const isOpen = computed(() => props.open)

// 使用主题颜色 hooks
const { primaryColor, hoverColor, activeColor, openColor } = useThemeColor()

// 解析抽屉宽度
const drawerWidthValue = computed(() => {
  return typeof props.drawerWidth === 'string'
    ? parseInt(props.drawerWidth.replace('px', ''))
    : props.drawerWidth
})

// 实际的手柄位置
const handleRight = ref<string>('0px')

// 更新手柄位置
const updateHandlePosition = () => {
  if (!props.drawerRef) {
    // 如果没有 ref，根据打开状态使用预设宽度
    handleRight.value = isOpen.value ? `${drawerWidthValue.value}px` : '0px'
    return
  }

  try {
    // 获取 drawer 的 DOM 元素
    const drawerElement = (props.drawerRef as any)?.$el || props.drawerRef
    if (!drawerElement) {
      handleRight.value = isOpen.value ? `${drawerWidthValue.value}px` : '0px'
      return
    }

    // 查找 drawer 的 content-wrapper
    const contentWrapper = drawerElement.querySelector?.('.ant-drawer-content-wrapper')
    if (contentWrapper) {
      const rect = contentWrapper.getBoundingClientRect()
      const rightDistance = window.innerWidth - rect.left

      // 如果 drawer 在屏幕内，使用实际位置；否则根据状态设置
      if (rect.left < window.innerWidth && rect.right > 0) {
        handleRight.value = `${Math.max(0, rightDistance)}px`
      } else {
        handleRight.value = isOpen.value ? `${drawerWidthValue.value}px` : '0px'
      }
    } else {
      // 如果找不到 content-wrapper，根据状态设置
      handleRight.value = isOpen.value ? `${drawerWidthValue.value}px` : '0px'
    }
  } catch (error) {
    // 出错时根据状态设置
    handleRight.value = isOpen.value ? `${drawerWidthValue.value}px` : '0px'
  }
}

// 使用 requestAnimationFrame 持续更新位置
let animationFrameId: number | null = null
let updateInterval: number | null = null

const startTracking = () => {
  // 停止之前的跟踪
  stopTracking()

  // 立即更新一次
  updateHandlePosition()

  // 使用 requestAnimationFrame 在动画期间持续更新
  const animate = () => {
    updateHandlePosition()
    animationFrameId = requestAnimationFrame(animate)
  }
  animate()

  // 同时使用定时器作为备用（每 16ms 更新一次，约 60fps）
  updateInterval = window.setInterval(() => {
    updateHandlePosition()
  }, 16)
}

const stopTracking = () => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }
  if (updateInterval) {
    clearInterval(updateInterval)
    updateInterval = null
  }
}

// 监听 drawer 打开/关闭状态
watch(
  () => isOpen.value,
  newValue => {
    if (newValue) {
      // drawer 打开时，先设置预设位置，然后启动跟踪
      handleRight.value = `${drawerWidthValue.value}px`
      // 延迟一点启动跟踪（确保 DOM 已渲染）
      nextTick(() => {
        setTimeout(() => {
          startTracking()
        }, 50)
      })
    } else {
      // drawer 关闭时，继续跟踪关闭动画
      startTracking()
      // 动画结束后停止跟踪
      setTimeout(() => {
        stopTracking()
        handleRight.value = '0px'
      }, 350)
    }
  },
  { immediate: true }
)

// 监听 drawerRef 变化
watch(
  () => props.drawerRef,
  () => {
    if (isOpen.value && props.drawerRef) {
      nextTick(() => {
        startTracking()
      })
    }
  }
)

onMounted(() => {
  if (isOpen.value) {
    nextTick(() => {
      startTracking()
    })
  }
})

onUnmounted(() => {
  stopTracking()
})

// 计算手柄位置样式
const handleStyle = computed(() => {
  // 如果 handleRight 还没有更新，根据 isOpen 状态使用预设值
  let rightValue = handleRight.value
  if (rightValue === '0px' && isOpen.value) {
    // 如果 drawer 打开但位置还是 0，使用预设宽度
    rightValue = `${drawerWidthValue.value}px`
  }

  const style: Record<string, string> = {
    right: rightValue,
    '--handle-primary-color': primaryColor.value,
    '--handle-open-color': openColor.value,
    '--handle-hover-color': hoverColor.value,
    '--handle-active-color': activeColor.value
  }

  return style
})

// 处理点击事件
const handleClick = (e: MouseEvent) => {
  e.stopPropagation()
  emit('click')
}
</script>

<style lang="scss" scoped>
.drawer-handle {
  // 始终使用 fixed 定位，根据 right 值动态调整位置
  position: fixed;
  top: 50%;
  z-index: 10001; // 确保在最上层，高于 Drawer 的 z-index (通常是 1000)
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  pointer-events: auto;
  cursor: pointer;
  background: var(--handle-primary-color, var(--ant-primary-color, #1890ff));
  border-radius: 6px 0 0 6px;
  box-shadow: 2px 0 8px rgb(0 0 0 / 15%);
  transform: translateY(-50%);

  // 与 Ant Design Drawer 动画时长保持一致，使用更平滑的缓动函数
  transition:
    right 0.3s cubic-bezier(0.645, 0.045, 0.355, 1),
    background-color 0.3s cubic-bezier(0.645, 0.045, 0.355, 1),
    box-shadow 0.3s cubic-bezier(0.645, 0.045, 0.355, 1),
    transform 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);

  // 使用 will-change 优化动画性能
  will-change: right, background-color, box-shadow, transform;

  &:hover {
    background: var(--handle-hover-color, var(--ant-primary-color-hover, #40a9ff));
    box-shadow: 2px 0 12px rgb(0 0 0 / 20%);
    transform: translateY(-50%) translateX(-2px);
  }

  &:active {
    background: var(--handle-active-color, var(--ant-primary-color-active, #0958d9));
    transform: translateY(-50%) translateX(-1px);
  }

  &--open {
    background: var(--handle-open-color, var(--ant-primary-color, #1890ff));
  }

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    color: var(--text-color-inverse, #fff);

    // 优化图标动画，使其更平滑
    transition:
      transform 0.2s cubic-bezier(0.645, 0.045, 0.355, 1),
      opacity 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  }

  &:hover &__icon {
    transform: scale(1.15);
  }
}

// 图标淡入淡出过渡效果
.icon-fade-enter-active,
.icon-fade-leave-active {
  transition:
    opacity 0.2s cubic-bezier(0.645, 0.045, 0.355, 1),
    transform 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.icon-fade-enter-from {
  opacity: 0;
  transform: rotate(-90deg) scale(0.8);
}

.icon-fade-leave-to {
  opacity: 0;
  transform: rotate(90deg) scale(0.8);
}

.icon-fade-enter-to,
.icon-fade-leave-from {
  opacity: 1;
  transform: rotate(0deg) scale(1);
}

/* 响应式设计 */
@media (width <= 768px) {
  .drawer-handle {
    width: 44px;
    height: 44px;

    &__icon {
      font-size: 18px;
    }
  }
}
</style>
