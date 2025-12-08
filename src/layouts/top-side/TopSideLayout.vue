<!--
 * @Author: liaokt
 * @Description: 
 * @Date: 2025-11-18 09:43:26
 * @LastEditors: liaokt
 * @LastEditTime: 2025-12-05 10:15:01
-->
<template>
  <a-layout class="top-side-layout">
    <LayoutHeader :show-logo="true" />
    <a-layout
      class="top-side-layout__body"
      :style="{ marginLeft: menuCollapsed ? '80px' : '200px' }"
    >
      <LayoutMenu ref="menuRef" :show-logo="false" @collapse-change="handleMenuCollapse" />
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
import { ref } from 'vue'
import LayoutHeader from '@/layouts/components/LayoutHeader.vue'
import LayoutMenu from '@/layouts/components/LayoutMenu.vue'
import LayoutFooter from '@/layouts/components/LayoutFooter.vue'

const menuRef = ref<InstanceType<typeof LayoutMenu> | null>(null)
const menuCollapsed = ref(false)

const handleMenuCollapse = (collapsed: boolean) => {
  menuCollapsed.value = collapsed
}
</script>

<style lang="scss" scoped>
.top-side-layout {
  min-height: 100vh;
}

.top-side-layout__body {
  margin-top: 64px; // header 高度
  transition: margin-left 0.2s ease;
}

.top-side-layout__content {
  background: var(--app-background);
  transition: background-color 0.3s ease;
}

.top-side-layout__main {
  padding: 24px;
}
</style>
