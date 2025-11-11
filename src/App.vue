<template>
  <a-config-provider :theme="themeConfig">
    <router-view />
  </a-config-provider>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useThemeStore } from '@/store/theme'

// 主题 store
const themeStore = useThemeStore()

// 主题配置
const themeConfig = computed(() => themeStore.themeConfig)
</script>
