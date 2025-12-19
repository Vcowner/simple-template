<!--
 * @Author: liaokt
 * @Description: 布局头部组件
 * @Date: 2025-12-03
-->
<template>
  <a-layout-header
    class="layout-header"
    :class="{
      'layout-header--dark': isDark,
      'layout-header--side-layout': sideLayout,
      'layout-header--with-menu': showMenu
    }"
  >
    <!-- 左侧：Logo 和标题 -->
    <Logo :show-logo="showLogo" :logo-url="logoUrl" :app-title="appTitle" />

    <!-- 中间：顶部菜单栏 -->
    <div v-if="showMenu" class="layout-header__menu">
      <a-menu
        v-model:selected-keys="selectedKeys"
        v-model:open-keys="openKeys"
        mode="horizontal"
        :theme="menuTheme"
        :items="menuItems"
        class="layout-header__menu-bar"
        :style="{
          '--menu-primary-color': primaryColor,
          '--menu-active-bg': activeBgColor,
          '--menu-hover-bg': hoverBgColor
        }"
        @click="handleMenuClick"
      />
    </div>

    <!-- 右侧：操作区域 -->
    <div class="layout-header__right">
      <a-space size="middle" class="layout-header__actions">
        <!-- 用户信息下拉菜单 -->
        <UserDropdown />
      </a-space>
    </div>
  </a-layout-header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { useThemeStore } from '@/store/modules/theme'
import { useThemeColor, useMenu } from '@/hooks'
import { getImageUrl } from '@/utils/logo'
import { SIDER_WIDTH, SIDER_COLLAPSED_WIDTH } from '@/layouts/constants/layout'
import UserDropdown from './components/UserDropdown/index.vue'
import Logo from './components/Logo/index.vue'

interface Props {
  showLogo?: boolean // 是否显示 Logo 和标题
  sideLayout?: boolean // 是否为侧边栏布局
  menuCollapsed?: boolean // 侧边栏是否折叠
  showMenu?: boolean // 是否显示顶部菜单栏
}

const props = withDefaults(defineProps<Props>(), {
  showLogo: true,
  sideLayout: false,
  menuCollapsed: false,
  showMenu: false
})

const appStore = useAppStore()
const themeStore = useThemeStore()

// 使用菜单 composable
const { menuItems, selectedKeys, openKeys, handleMenuClick } = useMenu()

// 计算 header 的 left 值（侧边栏布局时需要）
const headerLeft = computed(() => {
  if (!props.sideLayout) {
    return '0'
  }
  return props.menuCollapsed ? SIDER_COLLAPSED_WIDTH : SIDER_WIDTH
})

// 是否为暗色主题
const isDark = computed(() => themeStore.isDark)

// 菜单主题：根据整体主题模式决定
const menuTheme = computed<'light' | 'dark'>(() => {
  return themeStore.isDark ? 'dark' : 'light'
})

// 应用标题
const appTitle = computed(
  () => appStore.config.title || import.meta.env.VITE_APP_TITLE || 'Power IoT Traffic'
)

// Logo URL
const logoUrl = computed(() => {
  const url = appStore.getLogoUrl()
  return url ? getImageUrl(url) : null
})

// 使用主题颜色 hooks
const { primaryColor, activeBgColor, hoverBgColor } = useThemeColor()
</script>

<style lang="scss" scoped>
@use '@/assets/styles/_themes' as themes;
@use '../../../constants/styles.scss' as constants;

.layout-header {
  // 所有布局都使用 fixed 定位，确保顶部栏固定
  position: fixed;
  top: 0;
  right: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: constants.$header-height;
  padding: 0 constants.$content-padding;
  line-height: constants.$header-height;
  box-shadow: 2px 2px 8px rgb(0 0 0 / 6%);
  transition:
    background-color 0.3s ease,
    border-color 0.3s ease,
    box-shadow 0.3s ease;

  // 侧边栏布局时，left 值需要根据侧边栏宽度动态调整
  &.layout-header--side-layout {
    left: v-bind('headerLeft');
    transition: left 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  // 非侧边栏布局时，left 为 0
  &:not(.layout-header--side-layout) {
    left: 0;
  }

  &__menu {
    display: flex;
    align-items: center;
    margin-left: 32px;
  }

  &__menu-bar {
    line-height: constants.$header-height;
    background: transparent;
    border-bottom: none;

    // 菜单样式已移至 main.scss 中使用全局样式，通过 CSS 变量动态设置主题色

    // 调整菜单项高度以匹配 header 高度，使用原生下划线
    :deep(.ant-menu-item),
    :deep(.ant-menu-submenu-title) {
      height: constants.$header-height;
      line-height: constants.$header-height;
    }
  }

  &__right {
    display: flex;
    align-items: center;
    margin-left: auto; // 确保始终靠右对齐
  }

  &__actions {
    display: flex;
    align-items: center;
  }

  // 浅色主题样式（默认）
  &:not(.layout-header--dark) {
    @include themes.layout-header-light;
  }

  // 暗色主题样式
  &--dark {
    @include themes.layout-header-dark;
    box-shadow: 2px 2px 8px rgb(0 0 0 / 15%);
  }
}

/* 菜单项中图标和文字的间距 */
:deep(.ant-dropdown-menu-item) {
  .anticon {
    margin-right: 8px;
  }
}

/* 响应式设计 */
@media (width <= 768px) {
  .layout-header {
    padding: 0 16px;
  }
}
</style>
