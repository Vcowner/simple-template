<template>
  <footer class="layout-footer">
    <slot> © {{ new Date().getFullYear() }} {{ appTitle }}. All rights reserved. </slot>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const appTitle = computed(() => import.meta.env.VITE_APP_TITLE || 'Power IoT Traffic')
</script>

<style lang="scss" scoped>
.layout-footer {
  padding: 8px;
  color: var(--app-text-tertiary);
  text-align: center;
  background: var(--app-bg-tertiary);
  transition:
    background-color 0.3s ease,
    color 0.3s ease;
}
</style>
