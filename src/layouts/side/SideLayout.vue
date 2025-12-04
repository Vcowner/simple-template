<template>
  <a-layout class="side-layout">
    <LayoutMenu :show-logo="true" />
    <a-layout class="side-layout__content">
      <LayoutHeader :show-logo="false" />
      <a-layout-content class="side-layout__main">
        <slot>
          <router-view />
        </slot>
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

<style lang="scss" scoped>
.side-layout {
  min-height: 100vh;
}

.side-layout__content {
  margin-top: 64px; // header 高度
  margin-left: 200px; // menu 默认宽度
  background: var(--app-background);
  transition:
    margin-left 0.2s ease,
    background-color 0.3s ease;
}

// menu 折叠时的调整
:deep(.ant-layout-sider-collapsed) ~ .side-layout__content {
  margin-left: 80px;
}

.side-layout__main {
  padding: 24px;
}
</style>
