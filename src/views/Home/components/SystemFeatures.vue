<template>
  <section class="system-features">
    <div class="section-header">
      <h2 class="section-title">系统功能</h2>
      <p class="section-subtitle">基于流量特征的电力物联终端设备识别核心功能模块</p>
    </div>
    <a-row :gutter="24">
      <a-col v-for="item in features" :key="item.key" :xl="6" :lg="12" :md="12" :sm="24">
        <a-card class="feature-card" hoverable :bordered="false">
          <div class="feature-card__icon">
            <component :is="item.icon" />
          </div>
          <h3 class="feature-card__title">{{ item.title }}</h3>
          <p class="feature-card__desc">{{ item.desc }}</p>
          <a-typography-link :underline="false" class="feature-card__link">
            进入模块
            <span>›</span>
          </a-typography-link>
        </a-card>
      </a-col>
    </a-row>
  </section>
</template>

<script setup lang="ts">
import {
  DatabaseOutlined,
  ClusterOutlined,
  ExperimentOutlined,
  SafetyOutlined
} from '@ant-design/icons-vue'

interface FeatureItem {
  key: string
  icon: any
  title: string
  desc: string
}

const features: FeatureItem[] = [
  {
    key: 'packet',
    icon: DatabaseOutlined,
    title: '包级特征管理',
    desc: '数据包特征建模与设备指纹库构建'
  },
  {
    key: 'flow',
    icon: ClusterOutlined,
    title: '流级特征管理',
    desc: '数据流特征分析与流量规则构建'
  },
  {
    key: 'model',
    icon: ExperimentOutlined,
    title: '设备识别模型',
    desc: '特征关联与算法模型构建'
  },
  {
    key: 'validation',
    icon: SafetyOutlined,
    title: '识别方案验证',
    desc: '试点场景验证与结果分析'
  }
]
</script>

<style scoped lang="scss">
@use '@/assets/styles/_variables.scss' as vars;
@use '@/assets/styles/_mixins.scss' as mixins;

.system-features {
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

.feature-card {
  @include mixins.card;
  padding: 10px 4px;
  min-height: 220px;
  border: none;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 40px rgba(15, 38, 67, 0.16);
  }
}

.feature-card__icon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: linear-gradient(135deg, #eff4ff 0%, #f4faff 100%);
  color: vars.$app-primary;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  margin-bottom: 18px;
}

.feature-card__title {
  margin: 0 0 10px;
  font-size: 18px;
  font-weight: 600;
  color: vars.$app-text;
}

.feature-card__desc {
  margin: 0 0 18px;
  color: vars.$app-subtext;
  min-height: 44px;
}

.feature-card__link {
  color: vars.$app-primary;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.feature-card__link span {
  font-size: 18px;
  line-height: 1;
}
</style>
