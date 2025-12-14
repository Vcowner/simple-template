<!--
 * @Author: liaokt
 * @Description: 动态布局组件，根据导航模式动态切换布局
 * @Date: 2025-12-04
-->
<template>
  <component :is="layoutComponent">
    <slot />
  </component>
  <!-- 主题编辑器（包含抽屉和手柄）- 只在登录后的页面显示 -->
  <ThemeEditor v-if="shouldShowThemeEditor" v-model:open="showThemeEditor" />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAppStore } from '@/store/app'
import { useUserStore } from '@/store/user'
import { ThemeEditor } from '@/components/ThemeEditor'
import TopSideLayout from './top-side/TopSideLayout.vue'
import SideLayout from './side/SideLayout.vue'
import BasicLayout from './basic/BasicLayout.vue'

const appStore = useAppStore()
const userStore = useUserStore()

// 主题编辑器显示状态
const showThemeEditor = ref(false)

// 是否显示主题编辑器（只在登录后显示）
const shouldShowThemeEditor = computed(() => userStore.isLoggedIn)

const layoutComponent = computed(() => {
  switch (appStore.navigationMode) {
    case 'top-side':
      return TopSideLayout
    case 'side':
      return SideLayout
    case 'basic':
      return BasicLayout
    default:
      return TopSideLayout
  }
})
</script>
