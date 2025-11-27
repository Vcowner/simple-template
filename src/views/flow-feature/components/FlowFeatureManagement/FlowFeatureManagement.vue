<!--
 * @Author: liaokt
 * @Description: 流级特征管理页面
 * @Date: 2025-11-13 19:15:00
 * @LastEditors: liaokt
 * @LastEditTime: 2025-11-27 09:40:49
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
import { EditOutlined, PlusOutlined, EyeOutlined } from '@ant-design/icons-vue'
import MxTable from '@/components/MxTable/MxTable.vue'
import MxTableAction from '@/components/MxTableAction/MxTableAction.vue'
import { useModalController } from '@/components/MxModal'
import { TableColumnTypeEnum } from '@/components/MxTable/table'
import type { OperateButtonConfig } from '@/components/MxTableToolbar/type'
import type { TableActionItem } from '@/components/MxTableAction/MxTableAction.vue'
import { useTable } from '@/hooks'
import { useRequest } from '@/hooks/useRequest'
import { Tag } from 'ant-design-vue'
import { getFlowFeaturesList, deleteFlowFeature, type FlowFeature } from '@/api/flow-features'
import AddFlowFeatureModal from './components/AddFlowFeatureModal.vue'
import FlowFeatureDetailModal from './components/FlowFeatureDetailModal.vue'
import styles from '../../detail.module.scss'

const addFlowFeatureModal = useModalController(AddFlowFeatureModal)
const flowFeatureDetailModal = useModalController(FlowFeatureDetailModal)

const { tableProps, search, reload } = useTable(getFlowFeaturesList, {
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
  }
})

const columns = ref([
  {
    key: 'feature_id',
    title: '特征ID',
    dataIndex: 'feature_id',
    width: 120,
    align: 'center' as const,
    type: TableColumnTypeEnum.CUSTOM,
    customRender: ({ record }: { record: FlowFeature }) => {
      return h(
        'a',
        {
          style: { color: '#1890ff', cursor: 'pointer' },
          onClick: () => handleDetail(record)
        },
        record.feature_id
      )
    }
  },
  {
    key: 'data_flow_length',
    title: '数据流长度(KB)',
    dataIndex: 'data_flow_length',
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
    key: 'tcp_flags_list',
    title: 'TCP标记',
    dataIndex: 'tcp_flags_list',
    width: 200,
    align: 'center' as const,
    type: TableColumnTypeEnum.CUSTOM,
    customRender: ({ record }: { record: FlowFeature }) => {
      if (!record.tcp_flags_list || !Array.isArray(record.tcp_flags_list)) {
        return h('span', '-')
      }
      return h(
        'div',
        { style: { display: 'flex', gap: '4px', justifyContent: 'center', flexWrap: 'wrap' } },
        record.tcp_flags_list.map((flag: string) =>
          h(Tag, { color: 'blue', key: flag }, { default: () => flag })
        )
      )
    }
  },
  {
    key: 'ip_version_display',
    title: 'IP协议版本',
    dataIndex: 'ip_version_display',
    width: 130,
    align: 'center' as const,
    type: TableColumnTypeEnum.CUSTOM,
    customRender: ({ record }: { record: FlowFeature }) => {
      if (!record.ip_version_display) {
        return h('span', '-')
      }
      return h(Tag, { color: 'default' }, { default: () => record.ip_version_display })
    }
  },
  {
    key: 'related_rule_name',
    title: '关联规则',
    dataIndex: 'related_rule_name',
    width: 250,
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

const handleDetail = (record: FlowFeature) => {
  flowFeatureDetailModal.show({
    title: '特征详情',
    width: 520,
    id: record.id
  })
}

const handleEdit = async (record: FlowFeature) => {
  try {
    const result = await addFlowFeatureModal.show({
      title: '编辑流级特征',
      width: 520,
      id: record.id,
      type: 'edit'
    })

    if (result) {
      await reload()
    }
  } catch (error) {
    console.error('打开编辑弹窗失败:', error)
  }
}

// 使用 useRequest 创建删除功能
const { run: runDelete } = useRequest(deleteFlowFeature, {
  manual: true,
  showMessage: true,
  successMessage: '删除流级特征成功',
  onSuccess: () => {
    reload()
  },
  onError: error => {
    console.error('删除失败:', error)
  }
})

const handleDelete = (record: FlowFeature) => {
  runDelete({ id: record.id })
}

const handleAdd = async () => {
  try {
    const result = await addFlowFeatureModal.show({
      title: '新增流级特征',
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
