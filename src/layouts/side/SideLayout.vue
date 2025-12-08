<!--
 * @Author: liaokt
 * @Description: 
 * @Date: 2025-11-18 09:43:26
 * @LastEditors: liaokt
 * @LastEditTime: 2025-12-05 09:57:00
-->
<template>
  <a-layout class="side-layout">
    <LayoutMenu
      ref="menuRef"
      :show-logo="true"
      :side-layout="true"
      @collapse-change="handleMenuCollapse"
    />
    <a-layout
      class="side-layout__content"
      :style="{ marginLeft: menuCollapsed ? '80px' : '200px' }"
    >
      <LayoutHeader :show-logo="false" :side-layout="true" :menu-collapsed="menuCollapsed" />
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
import { ref } from 'vue'
import LayoutMenu from '@/layouts/components/LayoutMenu.vue'
import LayoutHeader from '@/layouts/components/LayoutHeader.vue'
import LayoutFooter from '@/layouts/components/LayoutFooter.vue'

const menuRef = ref<InstanceType<typeof LayoutMenu> | null>(null)
const menuCollapsed = ref(false)

const handleMenuCollapse = (collapsed: boolean) => {
  menuCollapsed.value = collapsed
}
</script>

<style lang="scss" scoped>
.side-layout {
  min-height: 100vh;
}

.side-layout__content {
  margin-top: 64px; // header 高度
  background: var(--app-background);
  transition:
    margin-left 0.2s ease,
    background-color 0.3s ease;
}

.side-layout__main {
  padding: 24px;
}
</style>
