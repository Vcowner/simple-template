<template>
  <div class="layout-menu">
    <a-layout-sider
      :collapsed="collapsed"
      collapsible
      class="layout-menu__sider"
      @collapse="handleCollapse"
    >
      <div class="layout-menu__logo">{{ appTitle }}</div>
      <a-menu v-model:selectedKeys="selectedKeys" mode="inline" theme="dark" :items="menuItems" />
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
  SettingOutlined
} from '@ant-design/icons-vue'

const collapsed = ref(false)
const selectedKeys = ref<string[]>(['home'])

const appTitle = computed(() => import.meta.env.VITE_APP_TITLE || 'Power IoT Traffic')

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

<style scoped>
.layout-menu {
  height: 100%;
}

.layout-menu__sider {
  min-height: 100vh;
}

.layout-menu__logo {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 600;
  font-size: 16px;
  letter-spacing: 0.5px;
}
</style>
