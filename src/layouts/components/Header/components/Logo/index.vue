<!--
 * @Author: liaokt
 * @Description: Logo 组件
 * @Date: 2025-12-10
-->
<template>
  <div v-if="showLogo" class="layout-header__left">
    <div class="layout-header__brand">
      <img v-if="logoUrl" :src="logoUrl" alt="Logo" class="layout-header__logo-img" />
      <span class="layout-header__logo-text">{{ appTitle }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  showLogo: boolean
  logoUrl: string | null
  appTitle: string
}>()
</script>

<style scoped>
.layout-header__left {
  display: flex;
  align-items: center;
  height: 100%;
}

.layout-header__brand {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 600;
}

.layout-header__logo-img {
  height: 32px;
  margin-right: 8px;
  border-radius: 4px;
}

.layout-header__logo-text {
  color: inherit;
  white-space: nowrap;
}
</style>
