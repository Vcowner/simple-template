<!--
 * @Author: liaokt
 * @Description: 
 * @Date: 2025-11-18 09:43:26
 * @LastEditors: liaokt
 * @LastEditTime: 2025-12-04 10:42:56
-->
<template>
  <a-layout class="top-side-layout">
    <LayoutHeader :show-logo="true" />
    <a-layout class="top-side-layout__body">
      <LayoutMenu :show-logo="false" />
      <a-layout class="top-side-layout__content">
        <a-layout-content class="top-side-layout__main">
          <slot>
            <router-view />
          </slot>
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

<style lang="scss" scoped>
.top-side-layout {
  min-height: 100vh;
}

.top-side-layout__body {
  margin-top: 64px; // header 高度
  margin-left: 200px; // menu 默认宽度
  transition: margin-left 0.2s ease;
}

// menu 折叠时的调整
:deep(.ant-layout-sider-collapsed) ~ .top-side-layout__content {
  margin-left: 80px;
}

.top-side-layout__content {
  background: var(--app-background);
  transition: background-color 0.3s ease;
}

.top-side-layout__main {
  padding: 24px;
}
</style>
