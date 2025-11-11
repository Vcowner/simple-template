<template>
  <a-layout class="home-layout">
    <a-layout-header class="home-layout__header">
      <HomeHeader />
    </a-layout-header>
    <a-layout-content class="home-layout__body">
      <HomeContent />
    </a-layout-content>
  </a-layout>
</template>

<script setup lang="ts">
import HomeHeader from './HomeHeader.vue'
import HomeContent from './HomeContent.vue'
</script>

<style scoped>
.home-layout {
  min-height: 100vh;
  background: #fcfcfc;
}

.home-layout__header {
  background: #fff;
  padding: 0;
  line-height: 64px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
}

.home-layout__body {
  display: flex;
  justify-content: center;
  padding: 24px 32px;
}

.home-layout__body :deep(.home-content) {
  width: 100%;
  max-width: 1200px;
  margin: 0;
}
</style>
