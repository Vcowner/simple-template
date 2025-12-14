<!--
 * @Author: liaokt
 * @Description: 
 * @Date: 2025-12-01 15:34:35
 * @LastEditors: liaokt
 * @LastEditTime: 2025-12-08 10:07:01
-->
<template>
  <div class="layout-menu" :class="{ 'layout-menu--side-layout': sideLayout }">
    <a-layout-sider
      :collapsed="collapsed"
      :theme="menuTheme"
      collapsible
      class="layout-menu__sider"
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
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons-vue'
import { useAppStore } from '@/store/app'
import { useThemeStore } from '@/store/theme'
import { useMenu, useThemeColor } from '@/hooks'
import { getImageUrl } from '@/utils/logo'

interface Props {
  showLogo?: boolean // 是否显示 Logo 和标题
  sideLayout?: boolean // 是否为侧边栏布局
}

const props = withDefaults(defineProps<Props>(), {
  showLogo: false,
  sideLayout: false
})

const emit = defineEmits<{
  collapseChange: [value: boolean]
}>()

const appStore = useAppStore()
const themeStore = useThemeStore()
const collapsed = ref(false)

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
  collapsed.value = value
  // 通知父组件折叠状态变化
  emit('collapseChange', value)
}

// 暴露折叠状态给父组件
defineExpose({
  collapsed
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/_themes' as themes;

.layout-menu {
  height: 100%;
}

.layout-menu__sider {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 999;
  overflow-y: auto;
}

// 侧边栏布局：从顶部开始，高度 100vh
.layout-menu--side-layout .layout-menu__sider {
  top: 0;
  height: 100vh;
  min-height: 100vh;
}

// 非侧边栏布局：从 header 下方开始
.layout-menu:not(.layout-menu--side-layout) .layout-menu__sider {
  top: 64px; // header 高度
  min-height: calc(100vh - 64px);
}

.layout-menu__logo-area {
  padding: 16px 24px;
  transition: border-color 0.3s ease;
}

.layout-menu__brand {
  display: flex;
  gap: 12px;
  align-items: center;
  height: 32px;
  cursor: pointer;
  transition: all 0.3s ease;

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
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.5px;
  white-space: nowrap;
  transition: color 0.3s ease;
}

/* Ant Design dark 主题会自动应用样式，logo 文字颜色继承主题 */
:deep(.ant-layout-sider-dark) {
  @include themes.layout-menu-dark;
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
  transition: all 0.3s ease;

  &:hover {
    opacity: 0.8;
  }

  :deep(.anticon) {
    font-size: 16px;
  }
}

/* 折叠状态下隐藏文字 */
:deep(.ant-layout-sider-collapsed) {
  .layout-menu__logo-text {
    display: none;
  }
}
</style>
