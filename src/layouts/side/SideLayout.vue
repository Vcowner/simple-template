<!--
 * @Author: liaokt
 * @Description: 
 * @Date: 2025-11-18 09:43:26
 * @LastEditors: liaokt
 * @LastEditTime: 2025-12-12 17:28:54
-->
<template>
  <a-layout class="side-layout">
    <SiderBar :show-logo="true" :side-layout="true" @collapse-change="toggleCollapsed" />
    <a-layout class="side-layout__content" :style="{ marginLeft: getCollapsed ? '80px' : '200px' }">
      <Header :show-logo="false" :side-layout="true" :menu-collapsed="getCollapsed" />
      <a-layout-content class="side-layout__main">
        <slot>
          <router-view />
        </slot>
      </a-layout-content>
      <Footer />
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import SiderBar from '@/layouts/components/SiderBar/index.vue'
import Header from '@/layouts/components/Header/index.vue'
import Footer from '@/layouts/components/Footer/index.vue'
import { useCollapsed } from '../hooks/useCollapsed'

const { getCollapsed, toggleCollapsed } = useCollapsed()
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
