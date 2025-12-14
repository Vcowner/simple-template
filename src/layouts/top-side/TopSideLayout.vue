<!--
 * @Author: liaokt
 * @Description: 
 * @Date: 2025-11-18 09:43:26
 * @LastEditors: liaokt
 * @LastEditTime: 2025-12-12 17:27:49
-->
<template>
  <a-layout class="top-side-layout">
    <Header :show-logo="true" />
    <a-layout
      class="top-side-layout__body"
      :style="{ marginLeft: getCollapsed ? '80px' : '200px' }"
    >
      <SiderBar :show-logo="false" @collapse-change="toggleCollapsed" />
      <a-layout class="top-side-layout__content">
        <a-layout-content class="top-side-layout__main">
          <slot>
            <router-view />
          </slot>
        </a-layout-content>
        <Footer />
      </a-layout>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import Header from '@/layouts/components/Header/index.vue'
import SiderBar from '@/layouts/components/SiderBar/index.vue'
import Footer from '@/layouts/components/Footer/index.vue'
import { useCollapsed } from '../hooks/useCollapsed'

const { getCollapsed, toggleCollapsed } = useCollapsed()
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
