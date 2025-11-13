<!--
 * @Author: liaokt
 * @Description: 流级特征管理页面
 * @Date: 2025-11-13 19:15:00
 * @LastEditors: liaokt
 * @LastEditTime: 2025-11-13 21:28:27
-->
<template>
  <a-card
    :class="styles['flow-feature-detail__container']"
    :bordered="false"
    :body-style="{ padding: '10px 24px 10px 24px' }"
  >
    <template #title>
      <div class="flow-feature-detail__card-header">
        <div class="flow-feature-detail__card-title-wrapper">
          <h3 class="flow-feature-detail__card-title">流级特征列表</h3>
          <p class="flow-feature-detail__card-subtitle">基于测量规则构建的数据流特征数据</p>
        </div>
      </div>
    </template>
    <MxTable
      v-bind="{
        ...tableProps,
        columns,
        searchList,
        operateList: tableOperateList,
        bordered: true
      }"
      @search="handleSearch"
      @reset="handleReset"
    />
  </a-card>
</template>

<script setup lang="ts">
import { ref, h, computed } from 'vue'
import { message } from 'ant-design-vue'
import { EditOutlined, PlusOutlined, EyeOutlined } from '@ant-design/icons-vue'
import MxTable from '@/components/MxTable/MxTable.vue'
import MxTableAction from '@/components/MxTableAction/MxTableAction.vue'
import { useModalController } from '@/components/MxModal'
import { TableColumnTypeEnum } from '@/components/MxTable/table'
import type { OperateButtonConfig } from '@/components/MxTableToolbar/type'
import type { TableActionItem } from '@/components/MxTableAction/MxTableAction.vue'
import { useTable } from '@/hooks'
import { Tag } from 'ant-design-vue'
import AddFlowFeatureModal from './components/AddFlowFeatureModal.vue'
import FlowFeatureDetailModal from './components/FlowFeatureDetailModal.vue'
import styles from '../../detail.module.scss'

const addFlowFeatureModal = useModalController(AddFlowFeatureModal)
const flowFeatureDetailModal = useModalController(FlowFeatureDetailModal)

// 模拟 API
const fetchFlowFeatureList = async () => {
  await new Promise(resolve => setTimeout(resolve, 300))

  const mockData = [
    {
      id: 'FF001',
      featureId: 'FF001',
      dataFlowLength: 25.5,
      duration: 15.2,
      tcpFlags: ['SYN', 'ACK'],
      ipProtocolVersion: 'IPv4',
      associatedRuleId: 'FR001',
      associatedRuleName: '配电终端数据流规则',
      createdAt: '2024-01-15 12:00:00'
    },
    {
      id: 'FF002',
      featureId: 'FF002',
      dataFlowLength: 8.3,
      duration: 5.8,
      tcpFlags: ['FIN', 'RST'],
      ipProtocolVersion: 'IPv6',
      associatedRuleId: 'FR002',
      associatedRuleName: '智能电表通信规则',
      createdAt: '2024-01-15 12:30:00'
    }
  ]

  return {
    list: mockData,
    total: mockData.length
  }
}

const { tableProps, search, reload } = useTable(fetchFlowFeatureList, {
  defaultPageSize: 10,
  manual: false
})

const columns = ref([
  {
    key: 'featureId',
    title: '特征ID',
    dataIndex: 'featureId',
    width: 120,
    align: 'center' as const,
    type: TableColumnTypeEnum.CUSTOM,
    customRender: ({ record }: { record: any }) => {
      return h(
        'a',
        {
          style: { color: '#1890ff', cursor: 'pointer' },
          onClick: () => handleDetail(record)
        },
        record.featureId
      )
    }
  },
  {
    key: 'dataFlowLength',
    title: '数据流长度(KB)',
    dataIndex: 'dataFlowLength',
    width: 150,
    align: 'center' as const,
    type: TableColumnTypeEnum.TEXT
  },
  {
    key: 'duration',
    title: '持续时间(s)',
    dataIndex: 'duration',
    width: 130,
    align: 'center' as const,
    type: TableColumnTypeEnum.TEXT
  },
  {
    key: 'tcpFlags',
    title: 'TCP标记',
    dataIndex: 'tcpFlags',
    width: 200,
    align: 'center' as const,
    type: TableColumnTypeEnum.CUSTOM,
    customRender: ({ record }: { record: any }) => {
      if (!record.tcpFlags || !Array.isArray(record.tcpFlags)) {
        return h('span', '-')
      }
      return h(
        'div',
        { style: { display: 'flex', gap: '4px', justifyContent: 'center', flexWrap: 'wrap' } },
        record.tcpFlags.map((flag: string) =>
          h(Tag, { color: 'blue', key: flag }, { default: () => flag })
        )
      )
    }
  },
  {
    key: 'ipProtocolVersion',
    title: 'IP协议版本',
    dataIndex: 'ipProtocolVersion',
    width: 130,
    align: 'center' as const,
    type: TableColumnTypeEnum.CUSTOM,
    customRender: ({ record }: { record: any }) => {
      if (!record.ipProtocolVersion) {
        return h('span', '-')
      }
      return h(Tag, { color: 'default' }, { default: () => record.ipProtocolVersion })
    }
  },
  {
    key: 'associatedRule',
    title: '关联规则',
    dataIndex: 'associatedRule',
    width: 250,
    type: TableColumnTypeEnum.CUSTOM,
    customRender: ({ record }: { record: any }) => {
      if (!record.associatedRuleName || !record.associatedRuleId) {
        return h('span', '-')
      }
      return h('div', [
        h('div', { style: { marginBottom: '0px' } }, record.associatedRuleName),
        h('div', { style: { fontSize: '12px', color: '#8c8c8c' } }, record.associatedRuleId)
      ])
    }
  },
  {
    key: 'createdAt',
    title: '创建时间',
    dataIndex: 'createdAt',
    width: 200,
    type: TableColumnTypeEnum.DATETIME
  },
  {
    key: 'actions',
    title: '操作',
    width: 120,
    fixed: 'right' as const,
    type: TableColumnTypeEnum.CUSTOM,
    customRender: ({ record }: { record: any }) => {
      const actions: TableActionItem[] = [
        {
          key: 'detail',
          icon: EyeOutlined,
          onClick: () => handleDetail(record)
        },
        {
          key: 'edit',
          icon: EditOutlined,
          onClick: () => handleEdit(record)
        },
        {
          key: 'delete',
          actionType: 'delete',
          deleteProps: {
            confirm: '确认删除该特征？',
            confirmType: 'popconfirm'
          },
          onClick: () => handleDelete(record)
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

const searchList = ref<any[]>([])

const tableOperateList = computed<OperateButtonConfig[]>(() => [
  {
    label: '新增流级特征',
    type: 'primary',
    icon: PlusOutlined,
    onClick: () => handleAdd()
  }
])

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
  flowFeatureDetailModal.show({
    title: '特征详情',
    width: 520,
    data: record
  })
}

const handleEdit = async (record: any) => {
  try {
    const result = await addFlowFeatureModal.show({
      title: '编辑流级特征',
      width: 520,
      featureId: record.featureId,
      type: 'edit',
      data: {
        dataFlowLength: record.dataFlowLength,
        duration: record.duration,
        tcpFlags: record.tcpFlags,
        ipProtocolVersion: record.ipProtocolVersion,
        associatedRuleId: record.associatedRuleId
      }
    })

    if (result) {
      console.log('编辑特征结果:', result)
      message.success('特征编辑成功')
      await reload()
    }
  } catch (error) {
    console.error('打开编辑弹窗失败:', error)
  }
}

const handleDelete = async (record: any) => {
  message.success(`已删除特征 ${record.featureId}`)
  console.log('删除特征', record)
  await reload()
}

const handleAdd = async () => {
  try {
    const result = await addFlowFeatureModal.show({
      title: '新增流级特征',
      width: 520
    })

    if (result) {
      const featureId = generateFeatureId()
      console.log('新增特征数据:', { ...result, featureId })
      message.success('新增流级特征成功')
      await reload()
    }
  } catch (error) {
    console.error('打开新增弹窗失败:', error)
  }
}

const generateFeatureId = () => {
  const random = Math.floor(Math.random() * 1000)
  return `FF${String(random).padStart(3, '0')}`
}
</script>

<style scoped lang="scss">
.flow-feature-detail__card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
}

.flow-feature-detail__card-title-wrapper {
  flex: 1;
}

.flow-feature-detail__card-title {
  margin: 0 0 4px;
  font-size: 16px;
  font-weight: 600;
  color: #0f2643;
  line-height: 1.4;
}

.flow-feature-detail__card-subtitle {
  margin: 0;
  font-size: 12px;
  font-weight: 400;
  color: #8c8c8c;
  line-height: 1.4;
}
</style>
