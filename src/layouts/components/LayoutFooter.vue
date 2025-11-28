<template>
  <footer class="layout-footer">
    <slot> © {{ new Date().getFullYear() }} {{ appTitle }}. All rights reserved. </slot>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const appTitle = computed(() => import.meta.env.VITE_APP_TITLE || 'Power IoT Traffic')
</script>

<style scoped>
.layout-footer {
  padding: 16px;
  color: rgb(0 0 0 / 45%);
  text-align: center;
  background: #f5f5f5;
}
</style>
