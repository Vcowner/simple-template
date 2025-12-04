<template>
  <a-layout class="basic-layout">
    <LayoutHeader />
    <a-layout-content class="basic-layout__content">
      <slot />
    </a-layout-content>
    <LayoutFooter />
  </a-layout>
</template>

<script setup lang="ts">
import LayoutHeader from '@/layouts/components/LayoutHeader.vue'
import LayoutFooter from '@/layouts/components/LayoutFooter.vue'
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
