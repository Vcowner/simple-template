<!--
 * @Author: liaokt
 * @Description: 设备指纹库查询详情页
 * @Date: 2025-11-14 00:00:00
 * @LastEditors: liaokt
 * @LastEditTime: 2025-11-14 14:37:58
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
import { getDeviceFingerprintsList, type DeviceFingerprint } from '@/api/device-fingerprints'
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

// 搜索配置
const searchList = ref<SearchConfigItem[]>([
  {
    key: 'device_type',
    name: '设备类型',
    type: 'select',
    placeholder: '请选择设备类型',
    width: 200,
    options: deviceTypeOptions.map(opt => ({ key: opt.value, value: opt.label }))
  },
  {
    key: 'device_name',
    name: '设备名称',
    type: 'input',
    placeholder: '请输入设备名称',
    width: 200
  },
  {
    key: 'fingerprint_id',
    name: '指纹ID',
    type: 'input',
    placeholder: '请输入指纹ID',
    width: 200
  }
])

const { tableProps, search } = useTable(getDeviceFingerprintsList, {
  defaultPageSize: 10,
  manual: false,
  searchFormatter: params => {
    // 过滤空值
    const filtered: Record<string, any> = {}
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== '' && params[key] !== null) {
        filtered[key] = params[key]
      }
    })
    return filtered
  },
  onSuccess: response => {
    // 更新统计数据
    if (response.data && Array.isArray(response.data)) {
      totalFingerprints.value = response.total || response.data.length
      smartMeterCount.value = response.data.filter(
        (item: DeviceFingerprint) => item.device_type === 'smart_meter'
      ).length
      distributionTerminalCount.value = response.data.filter(
        (item: DeviceFingerprint) => item.device_type === 'distribution_terminal'
      ).length
      associatedModelCount.value = response.data.filter(
        (item: DeviceFingerprint) => item.related_model_id && item.related_model_id !== ''
      ).length
    }
  }
})

// 表格列配置
const columns = ref([
  {
    key: 'fingerprint_id',
    title: '指纹ID',
    dataIndex: 'fingerprint_id',
    width: 120,
    type: TableColumnTypeEnum.TEXT
  },
  {
    key: 'device_name',
    title: '设备名称',
    dataIndex: 'device_name',
    width: 150,
    type: TableColumnTypeEnum.TEXT
  },
  {
    key: 'device_type_display',
    title: '设备类型',
    dataIndex: 'device_type_display',
    width: 120,
    align: 'center' as const,
    type: TableColumnTypeEnum.CUSTOM,
    customRender: ({ record }: { record: DeviceFingerprint }) => {
      return h(Tag, { color: 'blue' }, { default: () => record.device_type_display })
    }
  },
  {
    key: 'packet_features',
    title: '包级特征集合',
    dataIndex: 'packet_features',
    width: 280,
    type: TableColumnTypeEnum.TEXT
  },
  {
    key: 'flow_features',
    title: '流级特征集合',
    dataIndex: 'flow_features',
    width: 280,
    type: TableColumnTypeEnum.TEXT
  },
  {
    key: 'related_model_id',
    title: '关联模型ID',
    dataIndex: 'related_model_id',
    width: 150,
    align: 'center' as const,
    type: TableColumnTypeEnum.CUSTOM,
    customRender: ({ record }: { record: DeviceFingerprint }) => {
      return record.related_model_id || '-'
    }
  },
  {
    key: 'updated_at',
    title: '更新时间',
    dataIndex: 'updated_at',
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

const handleDetail = (record: DeviceFingerprint) => {
  fingerprintDetailModal.show({
    title: '设备指纹详情',
    width: 800,
    id: record.id
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
  padding: 10px 24px;
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
