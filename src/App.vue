<template>
  <a-config-provider :theme="themeConfig">
    <div class="container">
      <header>
        <h1>Simple Template</h1>
        <p class="subtitle">一个基于 Vue 3 的前端模板</p>
      </header>

      <main>
        <router-view />
      </main>

      <footer>
        <p>&copy; 2025 Simple Template. All rights reserved.</p>
      </footer>
    </div>
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
