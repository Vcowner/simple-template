<template>
  <a-layout class="top-side-layout">
    <LayoutHeader />
    <a-layout>
      <LayoutMenu />
      <a-layout class="top-side-layout__content">
        <a-layout-content class="top-side-layout__main">
          <slot />
        </a-layout-content>
        <LayoutFooter />
      </a-layout>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import LayoutHeader from '@/layouts/components/LayoutHeader.vue'
import LayoutMenu from '@/layouts/components/LayoutMenu.vue'
import LayoutFooter from '@/layouts/components/LayoutFooter.vue'
</script>

<style scoped>
.top-side-layout {
  min-height: 100vh;
}

.top-side-layout__content {
  background: #f0f2f5;
}

.top-side-layout__main {
  padding: 24px;
}
</style>
