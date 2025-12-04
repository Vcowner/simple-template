<!--
 * @Author: liaokt
 * @Description: 抽屉右侧吸附手柄组件（抽屉关闭时在屏幕右侧，打开时吸附在抽屉左侧）
 * @Date: 2025-12-04
-->
<template>
  <Teleport to="body">
    <div
      id="setting-drawer-handle"
      class="drawer-handle"
      :class="{ 'drawer-handle--open': isOpen }"
      :style="handleStyle"
      @click.stop="handleClick"
    >
      <span class="drawer-handle__icon">
        <CloseOutlined v-if="isOpen" />
        <SettingOutlined v-else />
      </span>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { CloseOutlined, SettingOutlined } from '@ant-design/icons-vue'
import { useThemeColor } from '@/hooks'

interface Props {
  /** 抽屉是否打开 */
  open?: boolean
  /** 抽屉宽度（单位：px） */
  drawerWidth?: number | string
}

interface Emits {
  (e: 'click'): void
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
  drawerWidth: 400
})

const emit = defineEmits<Emits>()

const isOpen = computed(() => props.open)

// 使用主题颜色 hooks
const { primaryColor, hoverColor, activeColor, openColor } = useThemeColor()

// 计算手柄位置样式 - 使用 right 定位更简单可靠
const handleStyle = computed(() => {
  // 解析抽屉宽度
  const drawerWidthValue =
    typeof props.drawerWidth === 'string'
      ? parseInt(props.drawerWidth.replace('px', ''))
      : props.drawerWidth

  // 使用 right 定位：
  // 抽屉关闭时：right = 0（紧贴屏幕右侧）
  // 抽屉打开时：right = drawerWidth（在抽屉左侧）
  const rightValue = isOpen.value ? `${drawerWidthValue}px` : '0px'

  const style: Record<string, string> = {
    right: rightValue,
    top: '50%',
    transform: 'translateY(-50%)',
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
  position: fixed;
  z-index: 10001; // 确保在最上层，高于 Drawer 的 z-index (通常是 1000) 和 mask (通常是 1000)
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  pointer-events: auto; // 恢复点击事件
  cursor: pointer;
  background: var(--handle-primary-color, var(--ant-primary-color, #1890ff));
  border-radius: 6px 0 0 6px;
  box-shadow: 2px 0 8px rgb(0 0 0 / 15%);
  transition:
    background-color 0.3s cubic-bezier(0.645, 0.045, 0.355, 1),
    box-shadow 0.3s cubic-bezier(0.645, 0.045, 0.355, 1),
    right 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);

  &:hover {
    background: var(--handle-hover-color, var(--ant-primary-color-hover, #40a9ff));
    box-shadow: 2px 0 12px rgb(0 0 0 / 20%);
  }

  &:active {
    background: var(--handle-active-color, var(--ant-primary-color-active, #0958d9));
  }

  &--open {
    background: var(--handle-open-color, var(--ant-primary-color, #1890ff));

    &:hover {
      background: var(--handle-hover-color, var(--ant-primary-color-hover, #40a9ff));
      box-shadow: 2px 0 12px rgb(0 0 0 / 20%);
    }

    &:active {
      background: var(--handle-active-color, var(--ant-primary-color-active, #0958d9));
    }
  }

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    color: var(--text-color-inverse, #fff);
    transition: transform 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  }

  &:hover &__icon {
    transform: scale(1.1);
  }
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
