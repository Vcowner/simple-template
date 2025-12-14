<!--
 * @Author: liaokt
 * @Description: 角色管理页面
 * @Date: 2025-12-12
-->
<template>
  <MxResponsiveContainer :padding="24" class="role-management">
    <MxTable
      v-bind="tableProps"
      :columns="columns"
      :search-list="searchList"
      :operate-list="operateList"
      :row-selection="rowSelection"
      @search="handleSearch"
      @reset="handleReset"
      @pagination-change="handlePaginationChange"
      @selection-change="handleSelectionChange"
    />
  </MxResponsiveContainer>
</template>

<script setup lang="ts">
import { computed, h } from 'vue'
import { message, Modal } from 'ant-design-vue'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import { MxResponsiveContainer } from '@/components/MxResponsiveContainer'
import MxTable from '@/components/MxTable/MxTable.vue'
import MxTableAction from '@/components/MxTableAction/MxTableAction.vue'
import { useTable } from '@/hooks/useTable'
import { TableColumnTypeEnum } from '@/components/MxTable/table'
import type { TableColumn } from '@/components/MxTable/table'
import type { SearchConfigItem, OperateButtonConfig } from '@/components/MxTableToolbar/type'
import { getRoleList, deleteRole } from '@/api/role'
import type { TableActionItem } from '@/components/MxTableAction/tableActionTypes'

// 使用 useTable hook
const { tableProps, search, selectedRowKeys, selectedRows, refresh } = useTable(getRoleList, {
  defaultPageSize: 10,
  manual: false
})

// 表格列配置
const columns: TableColumn[] = [
  {
    title: '角色编码',
    dataIndex: 'code',
    key: 'code',
    type: TableColumnTypeEnum.TEXT,
    width: 120
  },
  {
    title: '角色名称',
    dataIndex: 'name',
    key: 'name',
    type: TableColumnTypeEnum.TEXT,
    width: 150
  },
  {
    title: '角色描述',
    dataIndex: 'description',
    key: 'description',
    type: TableColumnTypeEnum.TEXT,
    width: 200
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    type: TableColumnTypeEnum.DATETIME,
    width: 180
  },
  {
    title: '操作',
    key: 'action',
    type: TableColumnTypeEnum.CUSTOM,
    width: 200,
    fixed: 'right',
    customRender: ({ record }: { text: any; record: any; index: number }) => {
      return h(MxTableAction, {
        actions: getActionList(record),
        maxCount: 3
      })
    }
  }
]

// 搜索配置
const searchList: SearchConfigItem[] = [
  {
    type: 'input',
    key: 'name',
    name: '角色名称',
    placeholder: '请输入角色名称',
    width: 200
  },
  {
    type: 'input',
    key: 'code',
    name: '角色编码',
    placeholder: '请输入角色编码',
    width: 200
  }
]

// 操作按钮配置
const operateList: OperateButtonConfig[] = [
  {
    label: '新增角色',
    icon: PlusOutlined,
    type: 'primary',
    onClick: handleAddRole
  }
]

// 行选择配置
const rowSelection = computed(() => ({
  selectedRowKeys: selectedRowKeys.value,
  onChange: (keys: any[], rows: any[]) => {
    selectedRowKeys.value = keys.map(key => String(key))
    selectedRows.value = rows
  }
}))

// 获取操作按钮列表
const getActionList = (record: any): TableActionItem[] => {
  const actions: TableActionItem[] = [
    {
      label: '编辑',
      key: 'edit',
      icon: EditOutlined,
      onClick: () => {
        handleEditRole(record)
      }
    }
  ]

  // 系统角色不可删除
  if (!record.isSystem) {
    actions.push({
      label: '删除',
      key: 'delete',
      icon: DeleteOutlined,
      actionType: 'delete',
      onClick: () => {
        handleDeleteRole(record)
      }
    })
  }

  return actions
}

// 搜索处理
const handleSearch = (params: Record<string, any>) => {
  search.submit(params)
}

// 重置处理
const handleReset = () => {
  search.reset()
}

// 分页变化处理
const handlePaginationChange = (pagination: { current: number; pageSize: number }) => {
  tableProps.value.onChange(pagination)
}

// 选择变化处理
const handleSelectionChange = (keys: string[], rows: any[]) => {
  selectedRowKeys.value = keys
  selectedRows.value = rows
}

// 新增角色
function handleAddRole() {
  message.info('新增角色功能待开发')
  // TODO: 打开新增角色弹窗
}

// 编辑角色
function handleEditRole(record: any) {
  message.info(`编辑角色: ${record.name}`)
  // TODO: 打开编辑角色弹窗
}

// 删除角色
function handleDeleteRole(record: any) {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除角色 "${record.name}" 吗？`,
    onOk: async () => {
      try {
        await deleteRole(record.code)
        message.success('删除成功')
        await refresh()
      } catch (error) {
        message.error('删除失败')
      }
    }
  })
}
</script>
