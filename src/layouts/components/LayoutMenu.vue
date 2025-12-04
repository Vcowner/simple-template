<!--
 * @Author: liaokt
 * @Description: 
 * @Date: 2025-12-01 15:34:35
 * @LastEditors: liaokt
 * @LastEditTime: 2025-12-04 16:07:58
-->
<template>
  <div class="layout-menu">
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
        mode="inline"
        :theme="menuTheme"
        :items="menuItems"
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
import { computed, h, reactive, ref } from 'vue'
import type { ItemType } from 'ant-design-vue'
import {
  HomeOutlined,
  AppstoreOutlined,
  BarChartOutlined,
  DatabaseOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons-vue'
import { useAppStore } from '@/store/app'
import { useThemeStore } from '@/store/theme'
import { getImageUrl } from '@/utils/logo'

interface Props {
  showLogo?: boolean // 是否显示 Logo 和标题
}

const props = withDefaults(defineProps<Props>(), {
  showLogo: false
})

const appStore = useAppStore()
const themeStore = useThemeStore()
const collapsed = ref(false)
const selectedKeys = ref<string[]>(['home'])

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

const menuItems = reactive<ItemType[]>([
  {
    key: 'home',
    icon: () => h(HomeOutlined),
    label: '首页'
  },
  {
    key: 'analysis',
    icon: () => h(BarChartOutlined),
    label: '流量分析'
  },
  {
    key: 'devices',
    icon: () => h(DatabaseOutlined),
    label: '终端设备'
  },
  {
    key: 'apps',
    icon: () => h(AppstoreOutlined),
    label: '应用管理'
  },
  {
    key: 'settings',
    icon: () => h(SettingOutlined),
    label: '系统设置'
  }
])

const handleCollapse = (value: boolean) => {
  collapsed.value = value
}
</script>

<style lang="scss" scoped>
@use '@/assets/styles/_themes' as themes;

.layout-menu {
  height: 100%;
}

.layout-menu__sider {
  position: fixed;
  top: 64px; // header 高度
  bottom: 0;
  left: 0;
  z-index: 999;
  min-height: calc(100vh - 64px);
  overflow-y: auto;
}

.layout-menu__logo-area {
  padding: 16px;
  transition: border-color 0.3s ease;
}

.layout-menu__brand {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: center;
  height: 32px;
  transition: all 0.3s ease;
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

/* Ant Design light 主题样式 */
:deep(.ant-layout-sider-light) {
  @include themes.layout-menu-light;
}

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

/* 折叠状态下居中显示 */
:deep(.ant-layout-sider-collapsed) {
  .layout-menu__brand {
    justify-content: center;
  }

  .layout-menu__logo-text {
    display: none;
  }
}
</style>
