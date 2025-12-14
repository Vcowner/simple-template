<!--
 * @Author: liaokt
 * @Description: 用户管理页面
 * @Date: 2025-12-08
-->
<template>
  <MxResponsiveContainer :padding="24" class="user-management">
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
import { getUserList } from '@/api/user'
import type { UserListParams } from '@/types/modules/user'

// API 请求函数
const fetchUserList = async (params?: UserListParams) => {
  const response = await getUserList(params)
  return response
}

// 使用 useTable hook
const { tableProps, search, selectedRowKeys, selectedRows, refresh } = useTable(fetchUserList, {
  defaultPageSize: 10,
  manual: false
})

// 表格列配置
const columns: TableColumn[] = [
  {
    title: '用户名',
    dataIndex: 'username',
    key: 'username',
    type: TableColumnTypeEnum.TEXT,
    width: 120
  },
  {
    title: '昵称',
    dataIndex: 'nickname',
    key: 'nickname',
    type: TableColumnTypeEnum.TEXT,
    width: 120
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    key: 'email',
    type: TableColumnTypeEnum.TEXT,
    width: 180
  },
  {
    title: '手机号',
    dataIndex: 'phone',
    key: 'phone',
    type: TableColumnTypeEnum.TEXT,
    width: 130
  },
  {
    title: '角色',
    dataIndex: 'role',
    key: 'role',
    type: TableColumnTypeEnum.SELECT,
    width: 100,
    options: [
      { label: '管理员', value: 'admin' },
      { label: '普通用户', value: 'user' }
    ]
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    type: TableColumnTypeEnum.STATUS,
    width: 100,
    options: [
      { label: '启用', value: 1, color: 'green' },
      { label: '禁用', value: 0, color: 'red' }
    ]
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
    key: 'username',
    name: '用户名',
    placeholder: '请输入用户名',
    width: 200
  },
  {
    type: 'select',
    key: 'status',
    name: '状态',
    placeholder: '请选择状态',
    width: 150,
    options: [
      { key: '', value: '全部' },
      { key: 1, value: '启用' },
      { key: 0, value: '禁用' }
    ]
  }
]

// 操作按钮配置
const operateList: OperateButtonConfig[] = [
  {
    label: '新增用户',
    icon: PlusOutlined,
    type: 'primary',
    onClick: handleAddUser
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
const getActionList = (record: any) => {
  return [
    {
      label: '编辑',
      key: 'edit',
      icon: EditOutlined,
      permission: ['A010101'],
      onClick: () => {
        handleEditUser(record)
      }
    },
    {
      label: '删除',
      key: 'delete',
      icon: DeleteOutlined,
      danger: true,
      actionType: 'delete' as const,
      onClick: () => {
        handleDeleteUser(record)
      }
    }
  ]
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

// 新增用户
function handleAddUser() {
  message.info('新增用户功能待开发')
  // TODO: 打开新增用户弹窗
}

// 编辑用户
function handleEditUser(record: any) {
  message.info(`编辑用户: ${record.username}`)
  // TODO: 打开编辑用户弹窗
}

// 删除用户
function handleDeleteUser(record: any) {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除用户 "${record.username}" 吗？`,
    onOk: async () => {
      try {
        // TODO: 调用删除 API
        message.success('删除成功')
        await refresh()
      } catch (error) {
        message.error('删除失败')
      }
    }
  })
}
</script>
