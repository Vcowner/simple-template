<!--
 * @Author: liaokt
 * @Description: 动态布局组件，根据导航模式动态切换布局
 * @Date: 2025-12-04
-->
<template>
  <component :is="layoutComponent">
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '@/store/app'
import TopSideLayout from './top-side/TopSideLayout.vue'
import SideLayout from './side/SideLayout.vue'
import BasicLayout from './basic/BasicLayout.vue'

const appStore = useAppStore()

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
