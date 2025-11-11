<template>
  <section class="system-info">
    <a-card class="system-info__card" :bordered="false">
      <div class="system-info__title">系统信息</div>
      <a-descriptions :column="1" size="small">
        <a-descriptions-item label="数据来源">设备指纹库 V1.0</a-descriptions-item>
        <a-descriptions-item label="试点场景"
          >公司智慧信息大区网络安全态势感知平台</a-descriptions-item
        >
        <a-descriptions-item label="系统版本">V1.0.0</a-descriptions-item>
      </a-descriptions>
    </a-card>
  </section>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
@use '@/assets/styles/_variables.scss' as vars;
@use '@/assets/styles/_mixins.scss' as mixins;

.system-info {
  margin-bottom: 0;
}

.system-info__card {
  @include mixins.card;
  padding: 24px 28px;
}

.system-info__title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  color: vars.$app-text;
}
</style>
