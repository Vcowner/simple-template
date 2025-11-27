<!--
 * @Author: liaokt
 * @Description: 
 * @Date: 2025-11-11 17:30:53
 * @LastEditors: liaokt
 * @LastEditTime: 2025-11-11 18:32:44
-->
<template>
  <header class="home-header">
    <div class="home-header__left">
      <div class="home-header__icon">
        <AppstoreOutlined />
      </div>
      <div class="home-header__text">
        <h1 class="home-header__title">{{ appTitle }}</h1>
      </div>
    </div>
    <div class="home-header__right">
      <a-space size="large" align="center">
        <a-space size="small" align="center">
          <a-avatar :size="32" class="home-header__avatar">
            <template #icon>
              <UserOutlined />
            </template>
          </a-avatar>
          <span class="home-header__user">管理员账号</span>
        </a-space>
        <a-popconfirm
          title="确定退出登录？"
          ok-text="确定"
          cancel-text="取消"
          @confirm="handleLogout"
        >
          <a-button size="small" danger>退出</a-button>
        </a-popconfirm>
      </a-space>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { AppstoreOutlined, UserOutlined } from '@ant-design/icons-vue'
import { useUserStore } from '@/store/user'

const router = useRouter()
const userStore = useUserStore()

const appTitle = computed(
  () => import.meta.env.VITE_APP_TITLE || '电力物联终端设备流量特征识别系统'
)

const handleLogout = () => {
  userStore.logout()
  message.success('已退出登录')
  router.replace('/login')
}
</script>

<style scoped lang="scss">
@use '@/assets/styles/_variables.scss' as vars;

.home-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
  max-width: 1200px;
  margin: 0 auto;
  background: #fff;
}

.home-header__left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.home-header__icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: linear-gradient(135deg, #e6f0ff 0%, #f4f8ff 100%);
  color: vars.$app-primary;
  font-size: 20px;
}

.home-header__text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.home-header__title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: vars.$app-text;
}

.home-header__subtitle {
  margin: 0;
  color: vars.$app-subtext;
  font-size: 12px;
}

.home-header__right {
  color: vars.$app-subtext;
}

.home-header__avatar {
  background: #eef2ff;
  color: vars.$app-primary;
}

.home-header__user {
  font-size: 14px;
}
</style>
