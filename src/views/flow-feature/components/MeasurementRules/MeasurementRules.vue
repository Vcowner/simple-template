<!--
 * @Author: liaokt
 * @Description: 
 * @Date: 2025-11-13 20:23:38
 * @LastEditors: liaokt
 * @LastEditTime: 2025-11-13 20:40:44
-->
<!--
 * @Author: liaokt
 * @Description: 数据流测量规则页面
 * @Date: 2025-11-13 19:15:00
 * @LastEditors: liaokt
 * @LastEditTime: 2025-11-13 19:15:00
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
          <h4 class="flow-feature-detail__card-title">数据流测量规则</h4>
          <p class="flow-feature-detail__card-subtitle">定义数据流特征的测量维度和阈值范围</p>
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
import { EditOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons-vue'
import MxTable from '@/components/MxTable/MxTable.vue'
import MxTableAction from '@/components/MxTableAction/MxTableAction.vue'
import { useModalController } from '@/components/MxModal'
import { TableColumnTypeEnum } from '@/components/MxTable/table'
import type { OperateButtonConfig } from '@/components/MxTableToolbar/type'
import type { TableActionItem } from '@/components/MxTableAction/MxTableAction.vue'
import { useTable } from '@/hooks'
import AddFlowRuleModal from './components/AddFlowRuleModal.vue'
import FlowRuleDetailModal from './components/FlowRuleDetailModal.vue'
import styles from '../../detail.module.scss'

const addFlowRuleModal = useModalController(AddFlowRuleModal)
const flowRuleDetailModal = useModalController(FlowRuleDetailModal)

// 模拟 API
const fetchFlowRuleList = async () => {
  await new Promise(resolve => setTimeout(resolve, 300))

  const mockData = [
    {
      id: 'FR001',
      ruleId: 'FR001',
      ruleName: '配电终端数据流规则',
      metricDimension: '数据流长度',
      thresholdRange: '5-100 KB',
      createdAt: '2024-01-15 10:30:00'
    },
    {
      id: 'FR002',
      ruleId: 'FR002',
      ruleName: '智能电表通信规则',
      metricDimension: '持续时间',
      thresholdRange: '1-30 秒',
      createdAt: '2024-01-15 11:45:00'
    }
  ]

  return {
    list: mockData,
    total: mockData.length
  }
}

const { tableProps, search, reload } = useTable(fetchFlowRuleList, {
  defaultPageSize: 10,
  manual: false
})

const columns = ref([
  {
    key: 'ruleId',
    title: '规则ID',
    dataIndex: 'ruleId',
    width: 120,
    align: 'center' as const,
    type: TableColumnTypeEnum.TEXT
  },
  {
    key: 'ruleName',
    title: '规则名称',
    dataIndex: 'ruleName',
    width: 220,
    type: TableColumnTypeEnum.TEXT
  },
  {
    key: 'metricDimension',
    title: '测量维度',
    dataIndex: 'metricDimension',
    width: 160,
    align: 'center' as const,
    type: TableColumnTypeEnum.TAG,
    color: 'blue'
  },
  {
    key: 'thresholdRange',
    title: '阈值范围',
    dataIndex: 'thresholdRange',
    width: 160,
    type: TableColumnTypeEnum.TEXT
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
    width: 140,
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
            confirm: '确认删除该规则？',
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
    label: '新增数据流测量规则',
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
  flowRuleDetailModal.show({
    title: '规则详情',
    width: 520,
    data: record
  })
}

const handleEdit = async (record: any) => {
  try {
    const result = await addFlowRuleModal.show({
      title: '编辑数据流测量规则',
      width: 520,
      ruleId: record.ruleId,
      type: 'edit',
      data: record
    })

    if (result) {
      console.log('编辑规则结果:', result)
      message.success('规则编辑成功')
      await reload()
    }
  } catch (error) {
    console.error('打开编辑弹窗失败:', error)
  }
}

const handleDelete = async (record: any) => {
  message.success(`已删除规则 ${record.ruleId}`)
  console.log('删除规则', record)
  await reload()
}

const handleAdd = async () => {
  try {
    const result = await addFlowRuleModal.show({
      title: '新增数据流测量规则',
      width: 520
    })

    if (result) {
      const ruleId = generateRuleId()
      console.log('新增规则数据:', { ...result, ruleId })
      message.success('新增数据流测量规则成功')
      await reload()
    }
  } catch (error) {
    console.error('打开新增弹窗失败:', error)
  }
}

const generateRuleId = () => {
  const random = Math.floor(Math.random() * 1000)
  return `FR${String(random).padStart(3, '0')}`
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
  margin: 0 0 2px;
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
