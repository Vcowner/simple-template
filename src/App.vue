<template>
  <a-config-provider :theme="themeConfig" :locale="locale">
    <router-view />
  </a-config-provider>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import { useThemeStore } from '@/store/theme'

// 主题 store
const themeStore = useThemeStore()

// 主题配置
const themeConfig = computed(() => themeStore.themeConfig)

// 语言配置 - 使用中文
const locale = zhCN
</script>
