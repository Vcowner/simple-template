<!--
 * @Author: liaokt
 * @Description: 
 * @Date: 2025-11-11 17:31:11
 * @LastEditors: liaokt
 * @LastEditTime: 2025-11-11 17:39:31
-->
<template>
  <div class="home-content">
    <section class="home-content__features">
      <SystemFeatures />
    </section>

    <section class="home-content__overview">
      <DataOverview />
    </section>

    <section class="home-content__info">
      <SystemInfo />
    </section>
  </div>
</template>

<script setup lang="ts">
import { SystemFeatures, DataOverview, SystemInfo } from './index'
</script>

<style scoped lang="scss">
@use '@/assets/styles/_variables.scss' as vars;
@use '@/assets/styles/_mixins.scss' as mixins;

.home-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.home-content__features,
.home-content__overview {
  @include mixins.card;
  padding: 24px 28px;
}

.home-content__info {
  background: transparent;
}

.home-content__info :deep(.system-info__card) {
  @include mixins.card;
}
</style>
