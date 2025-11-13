<!--
 * @Author: liaokt
 * @Description: 识别方案验证详情页
 * @Date: 2025-11-13 23:00:00
 * @LastEditors: liaokt
 * @LastEditTime: 2025-11-13 23:10:13
-->
<template>
  <div class="validation-page">
    <a-page-header
      :title="pageTitle"
      sub-title="试点场景验证与结果分析"
      :class="styles['flow-feature-detail__header']"
      @back="handleBack"
    >
      <template #backIcon>
        <ArrowLeftOutlined />
        返回首页
      </template>
      <template #extra>
        <a-tag color="blue">试点场景:公司管理信息大区网络安全态势感知平台</a-tag>
      </template>
    </a-page-header>

    <div class="validation-page__content">
      <!-- 配置阶段 -->
      <div class="validation-page__config">
        <a-card :bordered="false" class="validation-page__card validation-page__card--config">
          <template #title>
            <h3 class="validation-page__card-title">试点场景配置</h3>
          </template>
          <a-row :gutter="20">
            <a-col :xl="14" :lg="24">
              <a-form layout="vertical" class="validation-page__scenario-form">
                <a-form-item label="场景名称">
                  <a-select
                    v-model:value="selectedScenario"
                    :options="scenarioOptions"
                    placeholder="请选择场景名称"
                  />
                </a-form-item>
                <a-button
                  type="primary"
                  block
                  :loading="validating"
                  :disabled="!selectedScenario || selectedDevices.length === 0"
                  @click="handleStartValidation"
                >
                  <PlayCircleOutlined v-if="!validating" />
                  {{ validating ? '加载中' : '开始识别验证' }}
                </a-button>
              </a-form>
            </a-col>
            <a-col :xl="6" :lg="24">
              <div class="validation-page__device-section">
                <div class="validation-page__device-section-header">
                  <h4 class="validation-page__device-section-title">待识别设备列表</h4>
                  <span class="validation-page__device-section-count">
                    已选择{{ selectedDevices.length }}个设备
                  </span>
                </div>
                <div class="validation-page__device-list">
                  <a-checkbox-group
                    v-model:value="selectedDevices"
                    class="validation-page__checkbox-group"
                  >
                    <a-checkbox
                      v-for="device in deviceList"
                      :key="device.id"
                      :value="device.id"
                      class="validation-page__checkbox-item"
                    >
                      {{ device.name }}({{ device.type }})
                    </a-checkbox>
                  </a-checkbox-group>
                </div>
              </div>
            </a-col>
          </a-row>
        </a-card>
      </div>

      <!-- 结果展示阶段 -->
      <div v-if="showResults" class="validation-page__results">
        <!-- 统计卡片 -->
        <a-row :gutter="24" class="validation-page__stats">
          <a-col :xl="8" :lg="24">
            <a-card :bordered="false" class="validation-page__stat-card">
              <div class="validation-page__stat-content">
                <div class="validation-page__stat-left">
                  <div class="validation-page__stat-value validation-page__stat-value--primary">
                    {{ overallAccuracy }}%
                  </div>
                  <div class="validation-page__stat-label">总体准确率</div>
                </div>
                <CheckCircleOutlined
                  class="validation-page__stat-icon validation-page__stat-icon--success"
                />
              </div>
            </a-card>
          </a-col>
          <a-col :xl="8" :lg="24">
            <a-card :bordered="false" class="validation-page__stat-card">
              <div class="validation-page__stat-content">
                <div class="validation-page__stat-left">
                  <div class="validation-page__stat-value">{{ totalDevices }}</div>
                  <div class="validation-page__stat-label">验证设备总数</div>
                </div>
                <FileTextOutlined
                  class="validation-page__stat-icon validation-page__stat-icon--info"
                />
              </div>
            </a-card>
          </a-col>
          <a-col :xl="8" :lg="24">
            <a-card :bordered="false" class="validation-page__stat-card">
              <div class="validation-page__stat-content">
                <div class="validation-page__stat-left">
                  <div class="validation-page__stat-value validation-page__stat-value--danger">
                    {{ inconsistentCount }}
                  </div>
                  <div class="validation-page__stat-label">识别不一致数</div>
                </div>
                <ExclamationCircleOutlined
                  class="validation-page__stat-icon validation-page__stat-icon--warning"
                />
              </div>
            </a-card>
          </a-col>
        </a-row>

        <!-- 验证结果表格 -->
        <a-card
          :bordered="false"
          :body-style="{ padding: '10px 24px' }"
          class="validation-page__table-card"
        >
          <template #title>
            <h3 class="validation-page__card-title">验证结果</h3>
          </template>
          <MxTable
            v-bind="{
              ...tableProps,
              columns,
              operateList: tableOperateList,
              bordered: true
            }"
          />
        </a-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, h } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import {
  ArrowLeftOutlined,
  PlayCircleOutlined,
  CheckCircleOutlined,
  FileTextOutlined,
  ExclamationCircleOutlined,
  DownloadOutlined,
  SyncOutlined
} from '@ant-design/icons-vue'
import { Tag } from 'ant-design-vue'
import MxTable from '@/components/MxTable/MxTable.vue'
import { TableColumnTypeEnum } from '@/components/MxTable/table'
import type { OperateButtonConfig } from '@/components/MxTableToolbar/type'
import { useTable } from '@/hooks'
import styles from '../flow-feature/detail.module.scss'

const router = useRouter()
const pageTitle = '识别方案验证'

// 场景配置
const scenarioOptions = [
  { label: '智能电表接入场景', value: 'smart_meter' },
  { label: '配电终端通信场景', value: 'distribution_terminal' },
  { label: '采集器数据传输场景', value: 'collector' }
]
const selectedScenario = ref<string>('smart_meter')

// 设备列表
const deviceList = ref([
  { id: 'DEV001', name: '智能电表-001', type: '智能电表' },
  { id: 'DEV002', name: '配电终端-001', type: '配电终端' },
  { id: 'DEV003', name: '采集器-001', type: '采集器' },
  { id: 'DEV004', name: '智能电表-002', type: '智能电表' },
  { id: 'DEV005', name: '配电终端-002', type: '配电终端' }
])
const selectedDevices = ref<string[]>(['DEV001', 'DEV002'])

// 验证状态
const validating = ref(false)
const showResults = ref(false)

// 验证结果统计
const overallAccuracy = ref(100.0)
const totalDevices = ref(2)
const inconsistentCount = ref(0)

// 模拟 API
const fetchValidationResults = async () => {
  await new Promise(resolve => setTimeout(resolve, 300))

  const mockData = [
    {
      id: '1',
      deviceId: 'DEV001',
      deviceName: '智能电表-001',
      actualType: '智能电表',
      modelType: '智能电表',
      result: '一致',
      accuracy: 98.0,
      validationTime: '2025/11/13 22:37:52'
    },
    {
      id: '2',
      deviceId: 'DEV002',
      deviceName: '配电终端-001',
      actualType: '配电终端',
      modelType: '配电终端',
      result: '一致',
      accuracy: 95.6,
      validationTime: '2025/11/13 22:37:52'
    }
  ]

  return {
    list: mockData,
    total: mockData.length
  }
}

const { tableProps, reload } = useTable(fetchValidationResults, {
  defaultPageSize: 10,
  manual: false
})

// 表格列配置
const columns = ref([
  {
    key: 'deviceId',
    title: '设备ID',
    dataIndex: 'deviceId',
    width: 120,
    type: TableColumnTypeEnum.CUSTOM,
    customRender: ({ record }: { record: any }) => {
      return h('a', { style: { color: '#1890ff' } }, record.deviceId)
    }
  },
  {
    key: 'deviceName',
    title: '设备名称',
    dataIndex: 'deviceName',
    width: 180,
    type: TableColumnTypeEnum.TEXT
  },
  {
    key: 'actualType',
    title: '实际设备类型',
    dataIndex: 'actualType',
    width: 150,
    align: 'center' as const,
    type: TableColumnTypeEnum.CUSTOM,
    customRender: ({ record }: { record: any }) => {
      return h(Tag, { color: 'default' }, { default: () => record.actualType })
    }
  },
  {
    key: 'modelType',
    title: '模型识别类型',
    dataIndex: 'modelType',
    width: 150,
    align: 'center' as const,
    type: TableColumnTypeEnum.CUSTOM,
    customRender: ({ record }: { record: any }) => {
      return h(Tag, { color: 'blue' }, { default: () => record.modelType })
    }
  },
  {
    key: 'result',
    title: '识别结果',
    dataIndex: 'result',
    width: 120,
    align: 'center' as const,
    type: TableColumnTypeEnum.CUSTOM,
    customRender: ({ record }: { record: any }) => {
      return h(
        'div',
        { style: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' } },
        [h(CheckCircleOutlined, { style: { color: '#52c41a' } }), h('span', record.result)]
      )
    }
  },
  {
    key: 'accuracy',
    title: '识别准确率',
    dataIndex: 'accuracy',
    width: 120,
    align: 'center' as const,
    type: TableColumnTypeEnum.CUSTOM,
    customRender: ({ record }: { record: any }) => {
      return `${record.accuracy}%`
    }
  },
  {
    key: 'validationTime',
    title: '验证时间',
    dataIndex: 'validationTime',
    width: 200,
    type: TableColumnTypeEnum.TEXT
  }
])

// 操作按钮配置
const tableOperateList = computed<OperateButtonConfig[]>(() => [
  {
    label: '导出验证报告',
    type: 'primary',
    icon: DownloadOutlined,
    position: 'left',
    onClick: () => handleExportReport()
  },
  {
    label: '反馈更新指纹库',
    type: 'default',
    icon: SyncOutlined,
    position: 'left',
    onClick: () => handleUpdateFingerprint()
  }
])

const handleBack = () => {
  router.push('/')
}

const handleStartValidation = async () => {
  if (!selectedScenario.value || selectedDevices.value.length === 0) {
    message.warning('请选择场景名称和设备')
    return
  }

  validating.value = true

  // 模拟验证过程
  await new Promise(resolve => setTimeout(resolve, 2000))

  validating.value = false
  showResults.value = true
  await reload()
  message.success('识别验证完成')
}

const handleExportReport = () => {
  message.info('导出验证报告功能开发中')
}

const handleUpdateFingerprint = () => {
  message.info('反馈更新指纹库功能开发中')
}
</script>

<style scoped lang="scss">
.validation-page {
  background: #f5f6f8;
  min-height: 100vh;
}

.validation-page__content {
  padding: 24px;
  width: 1200px;
  margin: 0 auto;
}

.validation-page__config {
  margin-bottom: 24px;
  .validation-page__card {
    min-height: 400px;
  }
}

.validation-page__card--config {
  .ant-card-body {
    padding: 24px;
  }
}

.validation-page__card-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #0f2643;
}

.validation-page__scenario-form {
  max-width: 360px;
}

.validation-page__device-section {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.validation-page__device-section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.validation-page__device-section-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #0f2643;
}

.validation-page__device-section-count {
  font-size: 12px;
  color: #8c8c8c;
}

.validation-page__device-list {
  flex: 1;
  max-height: 320px;
  overflow-y: auto;
  padding-right: 4px;
}

.validation-page__checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.validation-page__checkbox-item {
  padding: 8px 0;
}

.validation-page__results {
  .validation-page__stats {
    margin-bottom: 24px;
  }
}

.validation-page__stat-card {
  .ant-card-body {
    padding: 24px;
  }
}

.validation-page__stat-content {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.validation-page__stat-left {
  display: flex;
  flex-direction: column;
}

.validation-page__stat-value {
  font-size: 32px;
  font-weight: 600;
  color: #0f2643;
  margin-bottom: 8px;

  &--primary {
    color: #1890ff;
  }

  &--danger {
    color: #ff4d4f;
  }
}

.validation-page__stat-label {
  font-size: 14px;
  color: #8c8c8c;
}

.validation-page__stat-icon {
  font-size: 32px;
  flex-shrink: 0;

  &--success {
    color: #52c41a;
  }

  &--info {
    color: #1890ff;
  }

  &--warning {
    color: #faad14;
  }
}

.validation-page__table-card {
  margin-top: 24px;
}
</style>
