<template>
  <a-layout class="side-layout">
    <LayoutMenu />
    <a-layout class="side-layout__content">
      <LayoutHeader />
      <a-layout-content class="side-layout__main">
        <slot />
      </a-layout-content>
      <LayoutFooter />
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import LayoutMenu from '@/layouts/components/LayoutMenu.vue'
import LayoutHeader from '@/layouts/components/LayoutHeader.vue'
import LayoutFooter from '@/layouts/components/LayoutFooter.vue'
</script>

<style scoped>
.side-layout {
  min-height: 100vh;
}

.side-layout__content {
  background: #f0f2f5;
}

.side-layout__main {
  padding: 24px;
}
</style>
