<!--
 * @Author: liaokt
 * @Description: 用户下拉菜单组件
 * @Date: 2025-12-10
-->
<template>
  <a-dropdown placement="bottomRight" :trigger="['click']">
    <div class="user-dropdown">
      <a-avatar :src="userInfo?.avatar" :size="32" class="user-dropdown__avatar">
        {{ userInfo?.name?.charAt(0).toUpperCase() }}
      </a-avatar>
      <span class="user-dropdown__username">{{ userInfo?.name }}</span>
      <DownOutlined class="user-dropdown__dropdown-icon" />
    </div>
    <template #overlay>
      <a-menu>
        <template v-for="item in menuItems" :key="item.key">
          <!-- 分割线 -->
          <a-menu-divider v-if="item.type === 'divider'" />

          <!-- 菜单项 -->
          <a-menu-item v-else :key="item.key" :danger="item.danger" @click="item.onClick">
            <component :is="item.icon" v-if="item.icon" />
            <span>{{ item.label }}</span>
          </a-menu-item>
        </template>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Modal, message } from 'ant-design-vue'
import { UserOutlined, SettingOutlined, LogoutOutlined, DownOutlined } from '@ant-design/icons-vue'
import { useUserStore } from '@/store/user'

const userStore = useUserStore()

const userInfo = computed(() => userStore.userInfo)

// 菜单项配置 - 每个菜单项都有独立的点击处理函数
const menuItems = computed(() => [
  {
    key: 'profile',
    label: '个人中心',
    icon: UserOutlined,
    danger: false,
    onClick: () => handleProfileClick()
  },
  {
    key: 'settings',
    label: '账户设置',
    icon: SettingOutlined,
    danger: false,
    onClick: () => handleSettingsClick()
  },
  {
    type: 'divider' as const
  },
  {
    key: 'logout',
    label: '退出登录',
    icon: LogoutOutlined,
    danger: true,
    onClick: () => handleLogoutClick()
  }
])

// 处理个人中心点击
const handleProfileClick = () => {
  message.info('跳转到个人中心')
  // TODO: 实现个人中心路由跳转
  // router.push('/profile')
}

// 处理账户设置点击
const handleSettingsClick = () => {
  message.info('跳转到账户设置')
  // TODO: 实现设置路由跳转
  // router.push('/settings')
}

// 处理退出登录点击
const handleLogoutClick = () => {
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

<style scoped>
.user-dropdown {
  display: flex;
  align-items: center;
  padding: 0 8px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.user-dropdown:hover {
  background-color: rgb(0 0 0 / 4%);
}

.user-dropdown__avatar {
  margin-right: 8px;
}

.user-dropdown__username {
  margin-right: 4px;
  font-size: 14px;
  color: inherit;
}

.user-dropdown__dropdown-icon {
  font-size: 12px;
  color: #999;
}
</style>
