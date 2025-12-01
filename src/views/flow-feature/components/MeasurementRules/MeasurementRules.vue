<!--
 * @Author: liaokt
 * @Description: 
 * @Date: 2025-11-13 20:23:38
 * @LastEditors: liaokt
 * @LastEditTime: 2025-11-27 08:59:12
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
import { EditOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons-vue'
import MxTable from '@/components/MxTable/MxTable.vue'
import MxTableAction from '@/components/MxTableAction/MxTableAction.vue'
import { useModalController } from '@/components/MxModal'
import { TableColumnTypeEnum } from '@/components/MxTable/table'
import type { OperateButtonConfig } from '@/components/MxTableToolbar/type'
import type { TableActionItem } from '@/components/MxTableAction/MxTableAction.vue'
import { useTable } from '@/hooks'
import { useRequest } from '@/hooks/useRequest'
import { getFlowRulesList, deleteFlowRule, type FlowRule } from '@/api/flow-rules'
import { FLOW_RULE_METRIC_SEARCH_OPTIONS, FLOW_RULE_METRIC_DICT } from '../../dictkey'
import AddFlowRuleModal from './components/AddFlowRuleModal.vue'
import FlowRuleDetailModal from './components/FlowRuleDetailModal.vue'
import styles from '../../detail.module.scss'

const addFlowRuleModal = useModalController(AddFlowRuleModal)
const flowRuleDetailModal = useModalController(FlowRuleDetailModal)

const { tableProps, search, reload } = useTable(getFlowRulesList, {
  defaultPageSize: 10,
  manual: false,
  searchFormatter: params => {
    const filtered: Record<string, any> = {}
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== '' && params[key] !== null) {
        filtered[key] = params[key]
      }
    })
    return filtered
  }
})

const columns = ref([
  {
    key: 'rule_id',
    title: '规则ID',
    dataIndex: 'rule_id',
    width: 120,
    align: 'center' as const,
    type: TableColumnTypeEnum.TEXT
  },
  {
    key: 'rule_name',
    title: '规则名称',
    dataIndex: 'rule_name',
    width: 220,
    type: TableColumnTypeEnum.TEXT
  },
  {
    key: 'measure_length',
    title: '测量维度',
    dataIndex: 'measure_length',
    width: 160,
    align: 'center' as const,
    type: TableColumnTypeEnum.TAG,
    color: 'blue',
    customRender: ({ text }: { text: string }) =>
      FLOW_RULE_METRIC_DICT[text as keyof typeof FLOW_RULE_METRIC_DICT] || text
  },
  {
    key: 'threshold_range',
    title: '阈值范围',
    dataIndex: 'threshold_range',
    width: 160,
    type: TableColumnTypeEnum.TEXT
  },
  {
    key: 'created_at',
    title: '创建时间',
    dataIndex: 'created_at',
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

const tableOperateList = computed<OperateButtonConfig[]>(() => [
  {
    label: '新增数据流测量规则',
    type: 'primary' as const,
    icon: PlusOutlined,
    onClick: () => handleAdd()
  }
])

const searchList = ref([
  {
    type: 'input' as const,
    key: 'rule_name',
    name: '规则名称',
    placeholder: '请输入规则名称',
    width: 200
  },
  {
    type: 'select' as const,
    key: 'measure_length',
    name: '测量维度',
    placeholder: '请选择测量维度',
    width: 200,
    options: FLOW_RULE_METRIC_SEARCH_OPTIONS
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

const handleDetail = (record: FlowRule) => {
  flowRuleDetailModal.show({
    title: '规则详情',
    width: 520,
    data: record
  })
}

const handleDeleteRequest = useRequest(deleteFlowRule, {
  manual: true,
  showMessage: true,
  successMessage: '删除数据流测量规则成功',
  onSuccess: () => reload()
})

const handleEdit = async (record: FlowRule) => {
  try {
    const result = await addFlowRuleModal.show({
      title: '编辑数据流测量规则',
      width: 520,
      id: record.id,
      type: 'edit',
      data: record
    })

    if (result) {
      await reload()
    }
  } catch (error) {
    console.error('打开编辑弹窗失败:', error)
  }
}

const handleDelete = (record: FlowRule) => {
  handleDeleteRequest.run({
    id: record.id
  })
}

const handleAdd = async () => {
  try {
    const result = await addFlowRuleModal.show({
      title: '新增数据流测量规则',
      width: 520
    })

    if (result) {
      await reload()
    }
  } catch (error) {
    console.error('打开新增弹窗失败:', error)
  }
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
  line-height: 1.4;
  color: #0f2643;
}

.flow-feature-detail__card-subtitle {
  margin: 0;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.4;
  color: #8c8c8c;
}
</style>
