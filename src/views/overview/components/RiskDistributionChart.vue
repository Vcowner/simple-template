<!--
 * @Author: liaokt
 * @Description: 风险分布图表组件
 * @Date: 2025-12-15
-->
<template>
  <a-card class="risk-distribution-chart">
    <template #title>
      <div class="risk-distribution-chart__header">
        <div class="risk-distribution-chart__title">风险分布</div>
        <div class="risk-distribution-chart__subtitle">各业务系统风险等级统计</div>
      </div>
    </template>
    <div class="risk-distribution-chart__content">
      <MxChart
        type="pie"
        :data="data"
        :config="{
          angleField: 'value',
          colorField: 'type',
          options: {
            tooltip: {
              title: (d: any) => `类型: ${d.type}`,
              items: [{ field: 'value', name: '数量' }]
            }
          }
        }"
        :height="300"
      />
    </div>
  </a-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { MxChart } from '@/components/MxChart'

/**
 * 风险分布数据
 */
const data = ref([
  { type: '高危', value: 45 },
  { type: '中危', value: 68 },
  { type: '低危', value: 30 }
])
</script>

<style lang="scss" scoped>
.risk-distribution-chart {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgb(0 0 0 / 4%);

  &__header {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-height: 60px;
    padding: 8px 0;
  }

  &__title {
    font-size: 16px;
    font-weight: 600;
    line-height: 1.5;
    color: rgb(0 0 0 / 85%);
  }

  &__subtitle {
    font-size: 14px;
    font-weight: 400;
    line-height: 1.5;
    color: rgb(0 0 0 / 65%);
  }

  &__content {
    width: 100%;
  }
}

// 暗色主题适配
[data-theme='dark'] {
  .risk-distribution-chart {
    &__title {
      color: rgb(255 255 255 / 85%);
    }

    &__subtitle {
      color: rgb(255 255 255 / 65%);
    }
  }
}
</style>
