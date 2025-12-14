<!--
 * @Author: liaokt
 * @Description: 
 * @Date: 2025-12-01 15:34:35
 * @LastEditors: liaokt
 * @LastEditTime: 2025-12-05 10:58:37
-->
<template>
  <a-layout class="basic-layout">
    <LayoutHeader :show-logo="true" :show-menu="true" />
    <a-layout-content class="basic-layout__content">
      <slot />
    </a-layout-content>
    <LayoutFooter />
  </a-layout>
</template>

<script setup lang="ts">
import LayoutHeader from '@/layouts/components/components/Header/index.vue'
import LayoutFooter from '@/layouts/components/components/Footer/index.vue'
</script>

<style lang="scss" scoped>
@use '../index.module.scss' as layout;
@use '../../constants/styles.scss' as constants;

.basic-layout {
  @include layout.layout-base;
  padding-top: constants.$header-height;
}

.basic-layout__content {
  @include layout.layout-content;
  @include layout.layout-main;
}
</style>
