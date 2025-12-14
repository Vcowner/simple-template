<!--
 * @Author: liaokt
 * @Description: 
 * @Date: 2025-11-18 09:43:26
 * @LastEditors: liaokt
 * @LastEditTime: 2025-12-04 11:45:34
-->
<template>
  <a-config-provider :theme="themeConfig" :locale="locale">
    <div :data-theme="themeMode">
      <MxModalProvider>
        <router-view />
      </MxModalProvider>
    </div>
  </a-config-provider>
</template>

<script setup lang="ts">
import { computed, watch, onMounted } from 'vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import { useThemeStore } from '@/store/theme'
import { MxModalProvider } from '@/components/MxModal'

// 主题 store
const themeStore = useThemeStore()

// 主题配置
const themeConfig = computed(() => themeStore.themeConfig)

// 主题模式（用于添加 data-theme 属性）
const themeMode = computed(() => themeStore.themeMode)

// 语言配置 - 使用中文
const locale = zhCN

// 同步主题模式到 body 元素，确保全局组件（如 message）也能正确应用主题
watch(
  themeMode,
  newMode => {
    if (typeof document !== 'undefined') {
      document.body.setAttribute('data-theme', newMode)
    }
  },
  { immediate: true }
)

// 组件挂载时也设置一次，确保初始化正确
onMounted(() => {
  if (typeof document !== 'undefined') {
    document.body.setAttribute('data-theme', themeMode.value)
  }
})
</script>
