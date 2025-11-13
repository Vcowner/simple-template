<template>
  <section class="data-overview">
    <div class="section-header">
      <h2 class="section-title">数据概览</h2>
      <p class="section-subtitle">系统关键数据统计与实时状态监控</p>
    </div>
    <a-row :gutter="24">
      <a-col v-for="item in overviewList" :key="item.key" :xl="8" :lg="12" :sm="24">
        <a-card
          class="overview-card"
          :bordered="false"
          hoverable
          :class="{ 'overview-card--clickable': getCardRoute(item.key) }"
          @click="handleCardClick(item.key)"
        >
          <div class="overview-card__head">
            <div class="overview-card__title">{{ item.title }}</div>
            <div class="overview-card__icon" :style="{ color: item.iconColor }">
              <component :is="item.icon" />
            </div>
          </div>
          <div class="overview-card__value">{{ item.value }}</div>
          <div class="overview-card__desc">{{ item.description }}</div>
          <a-tag color="blue" :bordered="false">{{ item.action }}</a-tag>
        </a-card>
      </a-col>
    </a-row>
  </section>
</template>

<script setup lang="ts">
import { DashboardOutlined, LineChartOutlined, CheckCircleOutlined } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'

const router = useRouter()

interface OverviewItem {
  key: string
  title: string
  value: number
  icon: any
  iconColor: string
  description: string
  action: string
}

const overviewList: OverviewItem[] = [
  {
    key: 'device-count',
    title: '指纹库设备数量',
    value: 3,
    icon: DashboardOutlined,
    iconColor: '#597ef7',
    description: '当前已构建设备指纹数',
    action: '待模型运行后更新'
  },
  {
    key: 'rule-count',
    title: '流级特征规则数',
    value: 2,
    icon: LineChartOutlined,
    iconColor: '#13c2c2',
    description: '已部署数据流特征规则',
    action: '待模型运行后更新'
  },
  {
    key: 'model-accuracy',
    title: '识别模型准确率',
    value: 3,
    icon: CheckCircleOutlined,
    iconColor: '#722ed1',
    description: '当前模型识别准确率',
    action: '待模型运行后更新'
  }
]

const getCardRoute = (key: string): string | null => {
  const routeMap: Record<string, string> = {
    'device-count': '/fingerprint',
    'rule-count': '/flow-feature',
    'model-accuracy': '/device-model'
  }
  return routeMap[key] || null
}

const handleCardClick = (key: string) => {
  const route = getCardRoute(key)
  if (route) {
    router.push(route)
  }
}
</script>

<style scoped lang="scss">
@use '@/assets/styles/_variables.scss' as vars;
@use '@/assets/styles/_mixins.scss' as mixins;

.data-overview {
  @include mixins.section-spacing;
}

.section-header {
  margin-bottom: 24px;
}

.section-title {
  @include mixins.section-title;
}

.section-subtitle {
  @include mixins.section-subtitle;
}

.overview-card {
  @include mixins.card;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-4px);
  }

  &--clickable {
    cursor: pointer;
  }
}

.overview-card__head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.overview-card__title {
  font-size: 16px;
  font-weight: 600;
  color: vars.$app-text;
}

.overview-card__icon {
  font-size: 22px;
}

.overview-card__value {
  font-size: 28px;
  font-weight: 600;
  color: vars.$app-text;
}

.overview-card__desc {
  color: vars.$app-subtext;
  margin-bottom: 2px;
  font-size: 12px;
}
</style>
