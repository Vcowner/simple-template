<!--
 * @Author: liaokt
 * @Description: 总览页面 - 展示关键指标统计
 * @Date: 2025-12-15
-->
<template>
  <div class="overview">
    <!-- 指标卡片 -->
    <a-row :gutter="[24, 24]" class="overview__metrics">
      <a-col v-for="metric in metrics" :key="metric.key" :xs="24" :sm="12" :lg="6">
        <MxMetricCard
          :title="metric.title"
          :value="metric.value"
          :prefix="metric.prefix"
          :suffix="metric.suffix"
          :show-info-icon="true"
          :icon="metric.icon"
          :comparisons="metric.comparisons"
          @info-click="handleInfoClick(metric)"
        />
      </a-col>
    </a-row>

    <!-- 图表卡片 -->
    <a-row :gutter="[24, 24]" class="overview__charts">
      <!-- 漏洞趋势 - 折线图 -->
      <a-col :xs="24" :lg="12">
        <VulnerabilityTrendChart />
      </a-col>

      <!-- 风险分布 - 饼图 -->
      <a-col :xs="24" :lg="12">
        <RiskDistributionChart />
      </a-col>
    </a-row>

    <!-- 最新漏洞列表 -->
    <div class="overview__vulnerabilities">
      <LatestVulnerabilitiesList />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { message } from 'ant-design-vue'
import {
  AppstoreOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons-vue'
import { MxMetricCard } from '@/components/MxMetricCard'
import type { ComparisonItem } from '@/components/MxMetricCard'
import VulnerabilityTrendChart from './components/VulnerabilityTrendChart.vue'
import RiskDistributionChart from './components/RiskDistributionChart.vue'
import LatestVulnerabilitiesList from './components/LatestVulnerabilitiesList.vue'

/**
 * 指标数据
 */
const metrics = ref([
  {
    key: 'total-assets',
    title: '总资产数',
    value: 2847,
    prefix: '',
    suffix: '',
    icon: AppstoreOutlined,
    comparisons: [
      {
        label: '较上月',
        value: 12.5,
        trend: 'up'
      }
    ] as ComparisonItem[]
  },
  {
    key: 'pending-vulnerabilities',
    title: '待处理漏洞',
    value: 143,
    prefix: '',
    suffix: '',
    icon: WarningOutlined,
    comparisons: [
      {
        label: '较上月',
        value: 8.2,
        trend: 'down'
      }
    ] as ComparisonItem[]
  },
  {
    key: 'repaired-this-month',
    title: '本月已修复',
    value: 89,
    prefix: '',
    suffix: '',
    icon: CheckCircleOutlined,
    comparisons: [
      {
        label: '较上月',
        value: 23.1,
        trend: 'up'
      }
    ] as ComparisonItem[]
  },
  {
    key: 'average-repair-time',
    title: '平均修复时长',
    value: 3.2,
    prefix: '',
    suffix: '天',
    icon: ClockCircleOutlined,
    comparisons: [
      {
        label: '较上月',
        value: 15.3,
        trend: 'down'
      }
    ] as ComparisonItem[]
  }
])

/**
 * 处理信息图标点击
 */
const handleInfoClick = (metric: any) => {
  message.info(`查看 ${metric.title} 的详细信息`)
  // TODO: 实现详细信息查看功能
}
</script>

<style lang="scss" scoped>
.overview {
  &__metrics {
    margin-bottom: 24px;
  }

  &__charts {
    margin-top: 24px;
  }

  &__vulnerabilities {
    margin-top: 24px;
  }
}
</style>
