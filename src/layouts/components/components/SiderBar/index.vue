<!--
 * @Author: liaokt
 * @Description: 
 * @Date: 2025-12-01 15:34:35
 * @LastEditors: liaokt
 * @LastEditTime: 2025-12-08 10:07:01
-->
<template>
  <a-layout-sider
    :collapsed="collapsed"
    :theme="menuTheme"
    collapsible
    :class="['layout-menu__sider', { 'layout-menu__sider--side-layout': sideLayout }]"
    @collapse="handleCollapse"
  >
    <!-- Logo 和标题区域 -->
    <div v-if="props.showLogo" class="layout-menu__logo-area">
      <div class="layout-menu__brand">
        <img v-if="logoUrl" :src="logoUrl" alt="Logo" class="layout-menu__logo-img" />
        <span v-if="!collapsed" class="layout-menu__logo-text">{{ appTitle }}</span>
      </div>
    </div>

    <a-menu
      v-model:selected-keys="selectedKeys"
      v-model:open-keys="openKeys"
      mode="inline"
      :theme="menuTheme"
      :items="menuItems"
      :style="{
        '--menu-primary-color': primaryColor,
        '--menu-active-bg': activeBgColor,
        '--menu-hover-bg': hoverBgColor
      }"
      @click="handleMenuClick"
    />

    <!-- 自定义触发器按钮 -->
    <template #trigger>
      <div class="layout-menu__trigger">
        <MenuFoldOutlined v-if="!collapsed" />
        <MenuUnfoldOutlined v-else />
      </div>
    </template>
  </a-layout-sider>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons-vue'
import { useAppStore } from '@/store/modules/app'
import { useThemeStore } from '@/store/modules/theme'
import { useMenu, useThemeColor } from '@/hooks'
import { getImageUrl } from '@/utils/logo'

interface Props {
  showLogo?: boolean // 是否显示 Logo 和标题
  sideLayout?: boolean // 是否为侧边栏布局
  collapsed?: boolean // 折叠状态（受控模式）
}

const props = withDefaults(defineProps<Props>(), {
  showLogo: false,
  sideLayout: false,
  collapsed: undefined
})

const emit = defineEmits<{
  collapseChange: [value: boolean]
}>()

const appStore = useAppStore()
const themeStore = useThemeStore()

// 如果传入了 collapsed prop，使用受控模式；否则使用本地状态
const localCollapsed = ref(false)
const collapsed = computed(() => {
  return props.collapsed !== undefined ? props.collapsed : localCollapsed.value
})

// 使用菜单 composable
const { menuItems, selectedKeys, openKeys, handleMenuClick } = useMenu()

// 获取主题色
const { primaryColor, activeBgColor, hoverBgColor } = useThemeColor()

// 菜单主题：根据整体主题模式决定
// 如果是暗色主题，菜单使用 dark；否则使用 light
const menuTheme = computed<'light' | 'dark'>(() => {
  return themeStore.isDark ? 'dark' : 'light'
})

const appTitle = computed(() => appStore.config.title || import.meta.env.VITE_APP_TITLE)

// Logo URL
const logoUrl = computed(() => {
  const url = appStore.getLogoUrl()
  return url ? getImageUrl(url) : null
})

const handleCollapse = (value: boolean) => {
  // 如果是受控模式（传入了 collapsed prop），只通知父组件
  // 否则更新本地状态并通知父组件
  if (props.collapsed === undefined) {
    localCollapsed.value = value
  }
  // 通知父组件折叠状态变化
  emit('collapseChange', value)
}

// 暴露折叠状态给父组件
defineExpose({
  collapsed: computed(() => collapsed.value)
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/_themes' as themes;
@use '../../../constants/styles.scss' as constants;

.layout-menu__sider {
  overflow-x: hidden; // 防止折叠时内容溢出
  overflow-y: auto;
  box-shadow: 2px 0 8px rgb(0 0 0 / 6%);
  transition:
    width constants.$transition-duration-fast constants.$transition-easing,
    min-width constants.$transition-duration-fast constants.$transition-easing,
    box-shadow constants.$transition-duration-normal ease;
}

// 侧边栏布局：固定定位，从顶部开始，占满视口高度
.layout-menu__sider--side-layout {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  height: 100vh;
}

// 非侧边栏布局（顶部+侧边栏布局）：固定定位，从 header 下方开始
.layout-menu__sider:not(.layout-menu__sider--side-layout) {
  position: fixed;
  top: constants.$header-height;
  left: 0;
  z-index: 999;
  height: calc(100vh - #{constants.$header-height});
}

.layout-menu__logo-area {
  padding: 16px constants.$content-padding;
  transition:
    padding constants.$transition-duration-fast constants.$transition-easing,
    border-color constants.$transition-duration-normal ease;
}

.layout-menu__brand {
  display: flex;
  gap: 12px;
  align-items: center;
  height: 32px;
  cursor: pointer;
  transition: all constants.$transition-duration-normal ease;

  &:hover {
    opacity: 0.8;
  }
}

.layout-menu__logo-img {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.layout-menu__logo-text {
  width: auto;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.5px;
  white-space: nowrap;
  opacity: 1;
  transition:
    opacity constants.$transition-duration-fast constants.$transition-easing,
    width constants.$transition-duration-fast constants.$transition-easing,
    margin constants.$transition-duration-fast constants.$transition-easing,
    color constants.$transition-duration-normal ease;
}

/* Ant Design dark 主题会自动应用样式，logo 文字颜色继承主题 */
:deep(.ant-layout-sider-dark) {
  @include themes.layout-menu-dark;
  box-shadow: 2px 0 8px rgb(0 0 0 / 15%);
}

/* 菜单选中状态样式 - 使用主题色
 * 样式已移至 main.scss 中使用全局样式，通过 CSS 变量动态设置主题色
 */

/* 自定义触发器按钮 */
.layout-menu__trigger {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 48px;
  font-size: 16px;
  cursor: pointer;
  transition:
    background-color constants.$transition-duration-fast ease,
    transform constants.$transition-duration-fast constants.$transition-easing;

  &:hover {
    background-color: rgb(0 0 0 / 6%);
  }

  &:active {
    transform: scale(0.95);
  }

  :deep(.anticon) {
    font-size: 16px;
    transition: transform constants.$transition-duration-fast constants.$transition-easing;
  }
}

/* 折叠状态下隐藏文字 - 使用动画 */
:deep(.ant-layout-sider-collapsed) {
  .layout-menu__logo-area {
    padding: 16px;
  }

  .layout-menu__logo-text {
    width: 0;
    margin: 0;
    overflow: hidden;
    opacity: 0;
  }

  // 菜单项文字也淡出
  .ant-menu-item,
  .ant-menu-submenu-title {
    span {
      opacity: 0;
      transition: opacity constants.$transition-duration-fast constants.$transition-easing;
    }
  }
}

// 展开状态下菜单项文字淡入
:deep(.ant-layout-sider:not(.ant-layout-sider-collapsed)) {
  .ant-menu-item,
  .ant-menu-submenu-title {
    span {
      opacity: 1;
      transition: opacity constants.$transition-duration-fast constants.$transition-easing 0.1s; // 延迟一点，等宽度动画开始后再显示
    }
  }
}
</style>
