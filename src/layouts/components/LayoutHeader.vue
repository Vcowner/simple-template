<template>
  <header class="layout-header">
    <div class="layout-header__left">
      <slot name="logo">
        <div class="layout-header__logo">{{ appTitle }}</div>
      </slot>
    </div>
    <div class="layout-header__right">
      <slot name="actions">
        <a-space size="middle">
          <a-button type="link">帮助中心</a-button>
          <a-button type="link">设置</a-button>
        </a-space>
      </slot>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const appTitle = computed(() => import.meta.env.VITE_APP_TITLE || 'Power IoT Traffic')
</script>

<style scoped>
.layout-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: 64px;
  background: #001529;
  color: #fff;
}

.layout-header__logo {
  font-weight: 600;
  font-size: 18px;
  letter-spacing: 0.5px;
}
</style>
