<!--
 * @Author: liaokt
 * @Description: 流级特征管理总页面
 * @Date: 2025-11-13 19:15:00
 * @LastEditors: liaokt
 * @LastEditTime: 2025-11-13 23:31:37
-->
<template>
  <div :class="styles['flow-feature-detail']">
    <a-page-header
      :class="styles['flow-feature-detail__header']"
      :title="pageTitle"
      sub-title="数据流特征与规则构建"
      @back="handleBack"
    >
      <template #backIcon>
        <ArrowLeftOutlined />
        返回首页
      </template>
      <template #extra>
        <div class="flow-feature-detail__extra">
          <a-tag color="blue">数据来源：流级特征库 V1.0</a-tag>
          <a-button
            type="primary"
            class="flow-feature-detail__link-button"
            @click="handleGoToModel"
          >
            跳转至识别模型
            <ArrowRightOutlined />
          </a-button>
        </div>
      </template>
    </a-page-header>

    <div :class="styles['flow-feature-detail__content']">
      <div class="flow-feature-detail__switch">
        <a-radio-group v-model:value="activeTab" button-style="solid">
          <a-radio-button value="measurement">数据流测量规则</a-radio-button>
          <a-radio-button value="feature">流级特征管理</a-radio-button>
        </a-radio-group>
      </div>

      <MeasurementRules v-if="activeTab === 'measurement'" />
      <FlowFeatureManagement v-else />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons-vue'
import MeasurementRules from './components/MeasurementRules/MeasurementRules.vue'
import FlowFeatureManagement from './components/FlowFeatureManagement/FlowFeatureManagement.vue'
import styles from './detail.module.scss'

const router = useRouter()
const pageTitle = '流级特征管理'

const activeTab = ref<'measurement' | 'feature'>('measurement')

const handleBack = () => {
  router.push('/')
}

const handleGoToModel = () => {
  router.push('/device-model')
}
</script>

<style scoped lang="scss">
.flow-feature-detail__switch {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 20px 16px;
}

.flow-feature-detail__extra {
  display: flex;
  gap: 12px;
  align-items: center;
}

.flow-feature-detail__link-button {
  display: inline-flex;
  gap: 4px;
  align-items: center;
}
</style>
