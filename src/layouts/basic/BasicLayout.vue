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

<style scoped>
.basic-layout {
  min-height: 100vh;
}

.basic-layout__content {
  background: #f0f2f5;
  padding: 24px;
}
</style>
