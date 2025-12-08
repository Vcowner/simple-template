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
    <div v-if="showLogo" class="layout-header__left">
      <slot name="logo">
        <div class="layout-header__brand">
          <img v-if="logoUrl" :src="logoUrl" alt="Logo" class="layout-header__logo-img" />
          <span class="layout-header__logo-text">{{ appTitle }}</span>
        </div>
      </slot>
    </div>

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
      />
    </div>

    <!-- 右侧：操作区域 -->
    <div class="layout-header__right">
      <!-- 自定义插槽 -->
      <slot name="actions">
        <a-space size="middle" class="layout-header__actions">
          <!-- 用户信息下拉菜单 -->
          <a-dropdown v-if="userInfo" placement="bottomRight" :trigger="['click']">
            <div class="layout-header__user">
              <a-avatar :src="userInfo.avatar" :size="32" class="layout-header__avatar">
                {{ userInfo.name?.charAt(0).toUpperCase() }}
              </a-avatar>
              <span class="layout-header__username">{{ userInfo.name }}</span>
              <DownOutlined class="layout-header__dropdown-icon" />
            </div>
            <template #overlay>
              <a-menu @click="handleUserMenuClick">
                <a-menu-item key="profile">
                  <UserOutlined />
                  <span>个人中心</span>
                </a-menu-item>
                <a-menu-item key="settings">
                  <SettingOutlined />
                  <span>账户设置</span>
                </a-menu-item>
                <a-menu-divider />
                <a-menu-item key="logout" danger>
                  <LogoutOutlined />
                  <span>退出登录</span>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </a-space>
      </slot>
    </div>
  </a-layout-header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Modal, message } from 'ant-design-vue'
import type { MenuInfo } from 'ant-design-vue/es/menu/src/interface'
import { UserOutlined, SettingOutlined, LogoutOutlined, DownOutlined } from '@ant-design/icons-vue'
import { useAppStore } from '@/store/app'
import { useUserStore } from '@/store/user'
import { useThemeStore } from '@/store/theme'
import { useThemeColor, useMenu } from '@/hooks'
import { getImageUrl } from '@/utils/logo'

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
const userStore = useUserStore()
const themeStore = useThemeStore()

// 使用 props 确保 lint 通过
const showLogo = computed(() => props.showLogo)
const sideLayout = computed(() => props.sideLayout)
const menuCollapsed = computed(() => props.menuCollapsed)
const showMenu = computed(() => props.showMenu)

// 使用菜单 composable
const { menuItems, selectedKeys, openKeys } = useMenu()

// 计算 header 的 left 值
const headerLeft = computed(() => {
  if (!sideLayout.value) {
    return '0'
  }
  return menuCollapsed.value ? '80px' : '200px'
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

// 用户信息
const userInfo = computed(() => userStore.userInfo)

// 使用主题颜色 hooks
const { primaryColor, activeBgColor, hoverBgColor } = useThemeColor()

// 处理用户菜单点击
const handleUserMenuClick = (info: MenuInfo) => {
  const key = String(info.key)
  switch (key) {
    case 'profile':
      message.info('跳转到个人中心')
      // TODO: 实现个人中心路由跳转
      // router.push('/profile')
      break
    case 'settings':
      message.info('跳转到账户设置')
      // TODO: 实现设置路由跳转
      // router.push('/settings')
      break
    case 'logout':
      handleLogout()
      break
    default:
      break
  }
}

// 处理退出登录
const handleLogout = () => {
  Modal.confirm({
    title: '确认退出',
    content: '确定要退出登录吗？',
    okText: '确定',
    cancelText: '取消',
    onOk: async () => {
      await userStore.logout()
      message.success('已退出登录')
    }
  })
}
</script>

<style lang="scss" scoped>
@use '@/assets/styles/_themes' as themes;

.layout-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  transition:
    background-color 0.3s ease,
    border-color 0.3s ease,
    left 0.2s ease;

  // 侧边栏布局时的 left 值
  &.layout-header--side-layout {
    left: v-bind('headerLeft');
  }

  // 非侧边栏布局时的 left 值
  &:not(.layout-header--side-layout) {
    left: 0;
  }

  &__left {
    display: flex;
    align-items: center;
  }

  &__brand {
    display: flex;
    gap: 12px;
    align-items: center;
    cursor: pointer;
    transition: opacity 0.3s ease;

    &:hover {
      opacity: 0.8;
    }
  }

  &__logo-img {
    width: 32px;
    height: 32px;
    object-fit: contain;
  }

  &__logo-text {
    font-size: 18px;
    font-weight: 600;
    letter-spacing: 0.5px;
    white-space: nowrap;
    transition: color 0.3s ease;
  }

  &__menu {
    display: flex;
    align-items: center;
    margin-left: 32px;
  }

  &__menu-bar {
    background: transparent;
    border-bottom: none;

    // 菜单样式已移至 main.scss 中使用全局样式，通过 CSS 变量动态设置主题色
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

  &__action-btn {
    display: flex;
    align-items: center;
    height: 32px;
    padding: 0 12px;
    border: none;
    transition: all 0.3s ease;

    &:hover {
      color: v-bind('primaryColor');
    }
  }

  &__user {
    display: flex;
    gap: 8px;
    align-items: center;
    height: 32px;
    padding: 0 12px;
    cursor: pointer;
    border-radius: 4px;
    transition: all 0.3s ease;
  }

  &__avatar {
    flex-shrink: 0;
    color: #fff; // 头像文字颜色设为白色
    background-color: v-bind('primaryColor');
  }

  &__username {
    font-size: 14px;
    white-space: nowrap;
    transition: color 0.3s ease;
  }

  &__dropdown-icon {
    font-size: 12px;
    transition:
      transform 0.3s ease,
      color 0.3s ease;
  }

  // 浅色主题样式（默认）
  &:not(.layout-header--dark) {
    @include themes.layout-header-light;

    .layout-header__action-btn {
      &:hover {
        background-color: v-bind('hoverBgColor');
      }
    }
  }

  // 暗色主题样式
  &--dark {
    @include themes.layout-header-dark;

    .layout-header__action-btn {
      &:hover {
        color: v-bind('primaryColor');
      }
    }
  }
}

/* 下拉菜单打开时旋转图标 */
:deep(.ant-dropdown-open) {
  .layout-header__dropdown-icon {
    transform: rotate(180deg);
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

    &__logo-text {
      font-size: 16px;
    }

    &__action-btn {
      padding: 0 8px;

      :deep(.anticon) {
        margin-right: 0;
      }

      :deep(span) {
        display: none;
      }
    }

    &__username {
      display: none;
    }
  }
}
</style>
