<!--
 * @Author: liaokt
 * @Description: 
 * @Date: 2025-12-01 15:34:35
 * @LastEditors: liaokt
 * @LastEditTime: 2025-12-05 10:58:37
-->
<template>
  <a-layout class="basic-layout">
    <LayoutHeader :show-logo="true" :show-menu="true" />
    <a-layout-content class="basic-layout__content">
      <slot />
    </a-layout-content>
    <LayoutFooter />
  </a-layout>
</template>

<script setup lang="ts">
import LayoutHeader from '@/layouts/components/Header/index.vue'
import LayoutFooter from '@/layouts/components/Footer/index.vue'
</script>

<style lang="scss" scoped>
.basic-layout {
  min-height: 100vh;
  padding-top: 64px; // header 高度
}

.basic-layout__content {
  padding: 24px;
  background: var(--app-background);
  transition: background-color 0.3s ease;
}
</style>
