<!--
 * @Author: liaokt
 * @Description: 设备识别模型配置页面
 * @Date: 2025-11-13 21:45:00
 * @LastEditors: liaokt
 * @LastEditTime: 2025-11-13 22:09:21
-->
<template>
  <div class="device-model-page">
    <a-page-header
      :title="pageTitle"
      sub-title="特征关联与模型建模"
      :class="styles['flow-feature-detail__header']"
      @back="handleBack"
    >
      <template #backIcon>
        <ArrowLeftOutlined />
        返回首页
      </template>
      <template #extra>
        <div class="device-model-page__extra">
          <a-tag color="blue">模型训练数据来源于试点场景日志</a-tag>
          <a-button
            type="primary"
            class="device-model-page__extra-button"
            @click="handleToValidation"
          >
            跳转至方案验证
            <ArrowRightOutlined />
          </a-button>
        </div>
      </template>
    </a-page-header>

    <div class="device-model-page__content">
      <a-row :gutter="21" justify="center">
        <a-col :xl="6" :lg="24">
          <FeatureSourceCard
            :packet-features="packetFeatureOptions"
            :flow-features="flowFeatureOptions"
            :packet-selection="selectedPacketFeatures"
            :flow-selection="selectedFlowFeatures"
            :confirmed="featureConfirmed"
            @update:packet-selection="handlePacketSelectionChange"
            @update:flow-selection="handleFlowSelectionChange"
            @confirm="handleFeatureConfirm"
          />
        </a-col>
        <a-col :xl="6" :lg="24" class="device-model-page__column">
          <ModelParameterCard
            :model-type="modelParams.modelType"
            :iterations="modelParams.iterations"
            :train-split="modelParams.trainSplit"
            :model-type-options="modelTypeOptions"
            :iteration-options="iterationOptions"
            :train-split-options="trainSplitOptions"
            :disabled="trainingStatus === 'training'"
            :loading="trainingStatus === 'training'"
            :start-disabled="!featureConfirmed"
            :training="trainingStatus === 'training'"
            :training-progress="trainingProgress"
            @update:model-type="value => (modelParams.modelType = value)"
            @update:iterations="value => (modelParams.iterations = value)"
            @update:train-split="value => (modelParams.trainSplit = value)"
            @start="handleStartTraining"
          />
        </a-col>
        <a-col :xl="6" :lg="24" class="device-model-page__column">
          <ModelResultCard
            :status="trainingStatus"
            :metrics="modelMetrics"
            :save-disabled="trainingStatus !== 'completed'"
            :saving="saveLoading"
            @save="handleSaveModel"
          />
        </a-col>
      </a-row>

      <a-row align="middle" :gutter="21" class="device-model-page__summary-row">
        <a-col v-if="featureConfirmed" :xl="18" :lg="24">
          <SelectedFeatureOverview
            :packet-features="packetFeatureOptions"
            :flow-features="flowFeatureOptions"
            :packet-selection="selectedPacketFeatures"
            :flow-selection="selectedFlowFeatures"
          />
        </a-col>
      </a-row>
      <a-row align="middle" :gutter="21" class="device-model-page__summary-row">
        <a-col v-if="trainingStatus !== 'idle'" :xl="18" :lg="24">
          <ModelConfigOverview :params="modelParams" :model-type-options="modelTypeOptions" />
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { message, Modal } from 'ant-design-vue'
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons-vue'
import { useRequest } from '@/hooks/useRequest'
import { calculateMetrics } from '@/api/training-metrics'
import FeatureSourceCard from './components/FeatureSourceCard.vue'
import ModelParameterCard from './components/ModelParameterCard.vue'
import ModelResultCard from './components/ModelResultCard.vue'
import SelectedFeatureOverview from './components/SelectedFeatureOverview.vue'
import ModelConfigOverview from './components/ModelConfigOverview.vue'
import styles from '../flow-feature/detail.module.scss'
import {
  PACKET_FEATURE_OPTIONS,
  FLOW_FEATURE_OPTIONS,
  PacketFeatureType,
  FlowFeatureType
} from './dictkey'

type TrainingStatus = 'idle' | 'training' | 'completed'

const router = useRouter()
const pageTitle = '设备识别模型'

const packetFeatureOptions = ref(PACKET_FEATURE_OPTIONS)
const flowFeatureOptions = ref(FLOW_FEATURE_OPTIONS)

const selectedPacketFeatures = ref<string[]>([PacketFeatureType.PACKET_SIZE])
const selectedFlowFeatures = ref<string[]>([FlowFeatureType.DATA_FLOW_LENGTH])
const featureConfirmed = ref(false)

const modelTypeOptions = [
  { label: '随机森林', value: 'random_forest' },
  { label: '支持向量机', value: 'svm' },
  { label: '梯度提升树', value: 'gbdt' }
]

const iterationOptions = [
  { label: '50', value: 50 },
  { label: '100', value: 100 },
  { label: '200', value: 200 }
]

const trainSplitOptions = [
  { label: '60%', value: 0.6 },
  { label: '70%', value: 0.7 },
  { label: '80%', value: 0.8 }
]

const modelParams = reactive({
  modelType: 'random_forest',
  iterations: 100,
  trainSplit: 0.8
})

const trainingStatus = ref<TrainingStatus>('idle')
const trainingProgress = ref(0)
const modelMetrics = reactive<{
  accuracy: string | null
  recall: string | null
  f1: string | null
}>({
  accuracy: null,
  recall: null,
  f1: null
})
const saveLoading = ref(false)

// 使用 useRequest 创建计算指标功能
const { run: runCalculateMetrics } = useRequest(calculateMetrics, {
  manual: true,
  showMessage: true,
  successMessage: '模型训练完成',
  onSuccess: response => {
    const data = response.data
    if (data) {
      modelMetrics.accuracy = data.accuracy
      modelMetrics.recall = data.recall
      modelMetrics.f1 = data.f1_score
      trainingProgress.value = 100
      trainingStatus.value = 'completed'
    }
  },
  onError: () => {
    trainingStatus.value = 'idle'
    trainingProgress.value = 0
  }
})

const handlePacketSelectionChange = (value: string[]) => {
  selectedPacketFeatures.value = value
}

const handleFlowSelectionChange = (value: string[]) => {
  selectedFlowFeatures.value = value
}

const handleBack = () => {
  router.push('/')
}

const handleToValidation = () => {
  router.push('/validation')
}

const handleFeatureConfirm = () => {
  if (selectedPacketFeatures.value.length === 0 || selectedFlowFeatures.value.length === 0) {
    message.warning('包级特征和流级特征都需要至少选择一项')
    return
  }
  featureConfirmed.value = true
  message.success('特征已确认')
}

const handleStartTraining = async () => {
  if (!featureConfirmed.value) {
    message.warning('请先确认特征来源配置')
    return
  }

  trainingStatus.value = 'training'
  trainingProgress.value = 0
  modelMetrics.accuracy = null
  modelMetrics.recall = null
  modelMetrics.f1 = null

  // 模拟训练进度
  const progressInterval = setInterval(() => {
    if (trainingProgress.value < 95) {
      trainingProgress.value += Math.random() * 5 + 2
      if (trainingProgress.value > 95) {
        trainingProgress.value = 95
      }
    }
  }, 150)

  try {
    // 调用真实接口
    await runCalculateMetrics({
      training_count: modelParams.iterations,
      training_ratio: modelParams.trainSplit
    })
    // 接口成功后，进度设置为 100，状态和指标已在 onSuccess 中设置
    clearInterval(progressInterval)
    trainingProgress.value = 100
  } catch (error) {
    clearInterval(progressInterval)
    console.error('训练失败:', error)
  }
}

const handleSaveModel = () => {
  Modal.confirm({
    title: '确认保存模型',
    content: '确认保存当前模型参数和训练结果？保存后可用于方案验证。',
    okText: '确认保存',
    cancelText: '取消',
    onOk: async () => {
      saveLoading.value = true
      try {
        await new Promise(resolve => setTimeout(resolve, 800))
        message.success('模型参数已保存')
      } finally {
        saveLoading.value = false
      }
    }
  })
}
</script>

<style scoped lang="scss">
.device-model-page {
  min-height: 100vh;
  background: #f5f6f8;
}

.device-model-page__extra {
  display: flex;
  gap: 12px;
  align-items: center;
}

.device-model-page__extra-button {
  display: inline-flex;
  gap: 4px;
  align-items: center;
}

.device-model-page__content {
  padding: 10px 24px;
}

.device-model-page__column {
  margin-top: 16px;
}

.device-model-page__summary-row {
  margin-top: 24px;
}

@media (width >= 1200px) {
  .device-model-page__column {
    margin-top: 0;
  }
}
</style>
