<!--
 * @Author: liaokt
 * @Description: 设备指纹库查询详情页
 * @Date: 2025-11-14 00:00:00
 * @LastEditors: liaokt
 * @LastEditTime: 2025-11-13 23:45:39
-->
<template>
  <div class="fingerprint-page">
    <a-page-header
      :title="pageTitle"
      sub-title="特征数据追溯"
      :class="styles['flow-feature-detail__header']"
      @back="handleBack"
    >
      <template #backIcon>
        <ArrowLeftOutlined />
        返回首页
      </template>
      <template #extra>
        <div class="fingerprint-page__extra">
          <a-tag color="blue">数据来源:设备指纹库 V1.0</a-tag>
          <a-button type="primary" @click="handleGoToPacketFeature">
            跳转至包级特征管理
            <ArrowRightOutlined />
          </a-button>
        </div>
      </template>
    </a-page-header>

    <div class="fingerprint-page__content">
      <!-- 统计卡片 -->
      <a-row :gutter="24" class="fingerprint-page__stats">
        <a-col :xl="6" :lg="12" :sm="24">
          <a-card :bordered="false" class="fingerprint-page__stat-card">
            <div class="fingerprint-page__stat-content">
              <div class="fingerprint-page__stat-left">
                <div class="fingerprint-page__stat-value">{{ totalFingerprints }}</div>
                <div class="fingerprint-page__stat-label">总指纹数</div>
              </div>
              <DatabaseOutlined
                class="fingerprint-page__stat-icon fingerprint-page__stat-icon--primary"
              />
            </div>
          </a-card>
        </a-col>
        <a-col :xl="6" :lg="12" :sm="24">
          <a-card :bordered="false" class="fingerprint-page__stat-card">
            <div class="fingerprint-page__stat-content">
              <div class="fingerprint-page__stat-left">
                <div class="fingerprint-page__stat-value">{{ smartMeterCount }}</div>
                <div class="fingerprint-page__stat-label">智能电表</div>
              </div>
              <CheckCircleOutlined
                class="fingerprint-page__stat-icon fingerprint-page__stat-icon--success"
              />
            </div>
          </a-card>
        </a-col>
        <a-col :xl="6" :lg="12" :sm="24">
          <a-card :bordered="false" class="fingerprint-page__stat-card">
            <div class="fingerprint-page__stat-content">
              <div class="fingerprint-page__stat-left">
                <div class="fingerprint-page__stat-value">{{ distributionTerminalCount }}</div>
                <div class="fingerprint-page__stat-label">配电终端</div>
              </div>
              <ExclamationCircleOutlined
                class="fingerprint-page__stat-icon fingerprint-page__stat-icon--warning"
              />
            </div>
          </a-card>
        </a-col>
        <a-col :xl="6" :lg="12" :sm="24">
          <a-card :bordered="false" class="fingerprint-page__stat-card">
            <div class="fingerprint-page__stat-content">
              <div class="fingerprint-page__stat-left">
                <div class="fingerprint-page__stat-value">{{ associatedModelCount }}</div>
                <div class="fingerprint-page__stat-label">关联模型</div>
              </div>
              <CalendarOutlined
                class="fingerprint-page__stat-icon fingerprint-page__stat-icon--purple"
              />
            </div>
          </a-card>
        </a-col>
      </a-row>

      <!-- 设备指纹库列表 -->
      <a-card :bordered="false" class="fingerprint-page__table-card">
        <template #title>
          <h3 class="fingerprint-page__card-title">设备指纹库列表</h3>
        </template>
        <MxTable
          v-bind="{
            ...tableProps,
            columns,
            searchList,
            bordered: true
          }"
          @search="handleSearch"
          @reset="handleReset"
        />
      </a-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, h } from 'vue'
import { useRouter } from 'vue-router'
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  DatabaseOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CalendarOutlined,
  EyeOutlined
} from '@ant-design/icons-vue'
import { Tag } from 'ant-design-vue'
import MxTable from '@/components/MxTable/MxTable.vue'
import MxTableAction from '@/components/MxTableAction/MxTableAction.vue'
import { TableColumnTypeEnum } from '@/components/MxTable/table'
import type { SearchConfigItem } from '@/components/MxTableToolbar/type'
import type { TableActionItem } from '@/components/MxTableAction/MxTableAction.vue'
import { useTable } from '@/hooks'
import { useModalController } from '@/components/MxModal'
import FingerprintDetailModal from './components/FingerprintDetailModal.vue'
import styles from '../flow-feature/detail.module.scss'

const router = useRouter()
const pageTitle = '设备指纹库查询'

const fingerprintDetailModal = useModalController(FingerprintDetailModal)

// 统计数据
const totalFingerprints = ref(3)
const smartMeterCount = ref(1)
const distributionTerminalCount = ref(1)
const associatedModelCount = ref(2)

// 设备类型选项
const deviceTypeOptions = [
  { label: '智能电表', value: 'smart_meter' },
  { label: '配电终端', value: 'distribution_terminal' },
  { label: '采集器', value: 'collector' }
]

// 是否关联识别模型选项
const associatedModelOptions = [
  { label: '是', value: 'yes' },
  { label: '否', value: 'no' }
]

// 搜索配置
const searchList = ref<SearchConfigItem[]>([
  {
    key: 'deviceType',
    name: '设备类型',
    type: 'select',
    placeholder: '请选择设备类型',
    width: 200,
    options: deviceTypeOptions.map(opt => ({ key: opt.value, value: opt.label }))
  },
  {
    key: 'macAddress',
    name: 'MAC地址',
    type: 'input',
    placeholder: '请输入MAC地址',
    width: 200
  },
  {
    key: 'startTime',
    name: '开始时间',
    type: 'date',
    placeholder: '请选择开始时间',
    width: 220
  },
  {
    key: 'endTime',
    name: '结束时间',
    type: 'date',
    placeholder: '请选择结束时间',
    width: 220
  },
  {
    key: 'isAssociated',
    name: '是否关联识别模型',
    type: 'select',
    placeholder: '请选择是否关联识别模型',
    width: 200,
    options: associatedModelOptions.map(opt => ({ key: opt.value, value: opt.label }))
  }
])

// 模拟 API
const fetchFingerprintList = async (params?: Record<string, any>) => {
  await new Promise(resolve => setTimeout(resolve, 300))

  const mockData = [
    {
      id: '1',
      fingerprintId: 'FP001',
      deviceName: '智能电表-001',
      deviceType: '智能电表',
      packetFeatures: '包大小:1.5KB, 端口:502, MAC:00:...',
      flowFeatures: '流长度:25.5KB, 时长:15.2s, 协议:I...',
      associatedModelId: 'MODEL_001',
      updateTime: '2024-01-15 10:30:00'
    },
    {
      id: '2',
      fingerprintId: 'FP002',
      deviceName: '配电终端-001',
      deviceType: '配电终端',
      packetFeatures: '包大小:2.1KB, 端口:80, MAC:00:2...',
      flowFeatures: '流长度:8.3KB, 时长:5.8s, 协议:IPv6',
      associatedModelId: 'MODEL_001',
      updateTime: '2024-01-15 11:45:00'
    },
    {
      id: '3',
      fingerprintId: 'FP003',
      deviceName: '采集器-001',
      deviceType: '采集器',
      packetFeatures: '包大小:0.8KB, 端口:443, MAC:00:...',
      flowFeatures: '流长度:12.7KB, 时长:8.9s, 协议:IP...',
      associatedModelId: '-',
      updateTime: '2024-01-15 12:15:00'
    }
  ]

  // 简单的过滤逻辑
  let filteredData = mockData
  if (params?.deviceType) {
    const typeMap: Record<string, string> = {
      smart_meter: '智能电表',
      distribution_terminal: '配电终端',
      collector: '采集器'
    }
    filteredData = filteredData.filter(item => item.deviceType === typeMap[params.deviceType])
  }
  if (params?.macAddress) {
    filteredData = filteredData.filter(item =>
      item.packetFeatures.toLowerCase().includes(params.macAddress.toLowerCase())
    )
  }
  if (params?.isAssociated === 'yes') {
    filteredData = filteredData.filter(item => item.associatedModelId !== '-')
  } else if (params?.isAssociated === 'no') {
    filteredData = filteredData.filter(item => item.associatedModelId === '-')
  }

  return {
    list: filteredData,
    total: filteredData.length
  }
}

const { tableProps, search } = useTable(fetchFingerprintList, {
  defaultPageSize: 10,
  manual: false
})

// 表格列配置
const columns = ref([
  {
    key: 'fingerprintId',
    title: '指纹ID',
    dataIndex: 'fingerprintId',
    width: 120,
    type: TableColumnTypeEnum.TEXT
  },
  {
    key: 'deviceName',
    title: '设备名称',
    dataIndex: 'deviceName',
    width: 150,
    type: TableColumnTypeEnum.TEXT
  },
  {
    key: 'deviceType',
    title: '设备类型',
    dataIndex: 'deviceType',
    width: 120,
    align: 'center' as const,
    type: TableColumnTypeEnum.CUSTOM,
    customRender: ({ record }: { record: any }) => {
      return h(Tag, { color: 'blue' }, { default: () => record.deviceType })
    }
  },
  {
    key: 'packetFeatures',
    title: '包级特征集合',
    dataIndex: 'packetFeatures',
    width: 280,
    type: TableColumnTypeEnum.TEXT
  },
  {
    key: 'flowFeatures',
    title: '流级特征集合',
    dataIndex: 'flowFeatures',
    width: 280,
    type: TableColumnTypeEnum.TEXT
  },
  {
    key: 'associatedModelId',
    title: '关联模型ID',
    dataIndex: 'associatedModelId',
    width: 150,
    align: 'center' as const,
    type: TableColumnTypeEnum.TEXT
  },
  {
    key: 'updateTime',
    title: '更新时间',
    dataIndex: 'updateTime',
    width: 200,
    type: TableColumnTypeEnum.DATETIME
  },
  {
    key: 'actions',
    title: '操作',
    width: 100,
    fixed: 'right' as const,
    type: TableColumnTypeEnum.CUSTOM,
    customRender: ({ record }: { record: any }) => {
      const actions: TableActionItem[] = [
        {
          key: 'detail',
          icon: EyeOutlined,
          onClick: () => handleDetail(record)
        }
      ]

      return h(MxTableAction, {
        actions,
        size: 'small',
        spacing: 8
      })
    }
  }
])

const handleBack = () => {
  router.push('/')
}

const handleGoToPacketFeature = () => {
  router.push('/packet-feature')
}

const handleSearch = (params: Record<string, any>, reset?: boolean) => {
  if (reset) {
    search.reset()
  } else {
    search.submit(params)
  }
}

const handleReset = () => {
  search.reset()
}

const handleDetail = (record: any) => {
  fingerprintDetailModal.show({
    title: '设备指纹详情',
    width: 800,
    data: record
  })
}
</script>

<style scoped lang="scss">
.fingerprint-page {
  background: #f5f6f8;
  min-height: 100vh;
}

.fingerprint-page__extra {
  display: flex;
  align-items: center;
  gap: 12px;
}

.fingerprint-page__content {
  padding: 24px;
}

.fingerprint-page__stats {
  margin-bottom: 24px;
}

.fingerprint-page__stat-card {
  .ant-card-body {
    padding: 24px;
  }
}

.fingerprint-page__stat-content {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.fingerprint-page__stat-left {
  display: flex;
  flex-direction: column;
}

.fingerprint-page__stat-value {
  font-size: 32px;
  font-weight: 600;
  color: #0f2643;
  margin-bottom: 8px;
}

.fingerprint-page__stat-label {
  font-size: 14px;
  color: #8c8c8c;
}

.fingerprint-page__stat-icon {
  font-size: 32px;
  flex-shrink: 0;

  &--primary {
    color: #1890ff;
  }

  &--success {
    color: #52c41a;
  }

  &--warning {
    color: #faad14;
  }

  &--purple {
    color: #722ed1;
  }
}

.fingerprint-page__table-card {
  .fingerprint-page__card-title {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: #0f2643;
  }
}
</style>
