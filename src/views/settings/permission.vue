<!--
 * @Author: liaokt
 * @Description: 权限管理页面
 * @Date: 2025-12-09
-->
<template>
  <MxResponsiveContainer :padding="24" class="permission-management">
    <MxTable
      v-bind="tableProps"
      :columns="columns"
      :search-list="searchList"
      :operate-list="operateList"
      :row-selection="rowSelection"
      :default-expand-all-rows="true"
      :pagination="false"
      @search="handleSearch"
      @reset="handleReset"
      @pagination-change="handlePaginationChange"
      @selection-change="handleSelectionChange"
    />
  </MxResponsiveContainer>
</template>

<script setup lang="ts">
import { computed, h, ref } from 'vue'
import { message, Modal } from 'ant-design-vue'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import { MxResponsiveContainer } from '@/components/MxResponsiveContainer'
import MxTable from '@/components/MxTable/MxTable.vue'
import MxTableAction from '@/components/MxTableAction/MxTableAction.vue'
import { TableColumnTypeEnum } from '@/components/MxTable/table'
import type { TableColumn } from '@/components/MxTable/table'
import type { SearchConfigItem, OperateButtonConfig } from '@/components/MxTableToolbar/type'
import { getPermissionList, deletePermission } from '@/api/permission'
import type { PermissionListItem, PermissionListParams } from '@/types/permission'
import { Tag } from 'ant-design-vue'

// 数据源
const dataSource = ref<PermissionListItem[]>([])
const loading = ref(false)
const selectedRowKeys = ref<string[]>([])
const selectedRows = ref<PermissionListItem[]>([])

// 搜索参数
const searchParams = ref<PermissionListParams>({})

// 获取权限列表
const fetchPermissionList = async (params?: PermissionListParams) => {
  loading.value = true
  try {
    const response = await getPermissionList(params)
    // 将扁平数据转换为树形结构
    dataSource.value = buildTree(response.list)
    return {
      list: dataSource.value,
      total: response.total
    }
  } catch (error) {
    console.error('获取权限列表失败:', error)
    message.error('获取权限列表失败')
    return {
      list: [],
      total: 0
    }
  } finally {
    loading.value = false
  }
}

// 构建树形结构
const buildTree = (list: PermissionListItem[]): PermissionListItem[] => {
  if (!list || list.length === 0) {
    return []
  }

  const map = new Map<string, PermissionListItem & { children?: PermissionListItem[] }>()
  const tree: PermissionListItem[] = []

  // 创建映射
  list.forEach(item => {
    map.set(item.code, { ...item, children: [] })
  })

  // 构建树结构
  list.forEach(item => {
    const node = map.get(item.code)!
    // 如果有父权限编码且父权限存在，则添加到父权限的 children 中
    if (item.parentCode && item.parentCode.trim() !== '' && map.has(item.parentCode)) {
      const parent = map.get(item.parentCode)!
      if (!parent.children) {
        parent.children = []
      }
      parent.children.push(node)
    } else {
      // 否则作为根节点
      tree.push(node)
    }
  })

  return tree
}

// 刷新数据
const refresh = async () => {
  await fetchPermissionList(searchParams.value)
}

// 初始化加载
fetchPermissionList()

// 表格属性
const tableProps = computed(() => ({
  dataSource: dataSource.value,
  loading: loading.value,
  rowKey: 'code'
}))

// 表格列配置
const columns: TableColumn[] = [
  {
    title: '权限编码',
    dataIndex: 'code',
    key: 'code',
    type: TableColumnTypeEnum.TEXT,
    width: 150,
    fixed: 'left'
  },
  {
    title: '权限名称',
    dataIndex: 'name',
    key: 'name',
    type: TableColumnTypeEnum.TEXT,
    width: 200
  },
  {
    title: '权限类型',
    dataIndex: 'type',
    key: 'type',
    type: TableColumnTypeEnum.CUSTOM,
    width: 100,
    customRender: ({ text }: { text: string }) => {
      const isMenu = text === 'menu'
      return h(
        Tag,
        {
          color: isMenu ? 'blue' : 'green'
        },
        { default: () => (isMenu ? '菜单权限' : '操作权限') }
      )
    }
  },
  {
    title: '父权限编码',
    dataIndex: 'parentCode',
    key: 'parentCode',
    type: TableColumnTypeEnum.TEXT,
    width: 150
  },
  {
    title: '路由名称',
    dataIndex: 'routeName',
    key: 'routeName',
    type: TableColumnTypeEnum.TEXT,
    width: 150
  },
  {
    title: '操作',
    key: 'action',
    type: TableColumnTypeEnum.CUSTOM,
    width: 200,
    fixed: 'right',
    customRender: ({ record }: { text: any; record: PermissionListItem; index: number }) => {
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
    name: '权限名称',
    placeholder: '请输入权限名称',
    width: 200
  },
  {
    type: 'select',
    key: 'type',
    name: '权限类型',
    placeholder: '请选择权限类型',
    width: 150,
    options: [
      { key: '', value: '全部' },
      { key: 'menu', value: '菜单权限' },
      { key: 'button', value: '操作权限' }
    ]
  }
]

// 操作按钮配置
const operateList: OperateButtonConfig[] = [
  {
    label: '新增权限',
    icon: PlusOutlined,
    type: 'primary',
    onClick: handleAddPermission
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
const getActionList = (record: PermissionListItem) => {
  return [
    {
      label: '编辑',
      key: 'edit',
      icon: EditOutlined,
      onClick: () => {
        handleEditPermission(record)
      }
    },
    {
      label: '删除',
      key: 'delete',
      icon: DeleteOutlined,
      danger: true,
      actionType: 'delete' as const,
      onClick: () => {
        handleDeletePermission(record)
      }
    }
  ]
}

// 搜索处理
const handleSearch = (params: Record<string, any>) => {
  searchParams.value = params
  fetchPermissionList(params)
}

// 重置处理
const handleReset = () => {
  searchParams.value = {}
  fetchPermissionList()
}

// 分页变化处理
const handlePaginationChange = (_pagination: { current: number; pageSize: number }) => {
  // 树形表格不需要分页
}

// 选择变化处理
const handleSelectionChange = (keys: string[], rows: PermissionListItem[]) => {
  selectedRowKeys.value = keys
  selectedRows.value = rows
}

// 新增权限
function handleAddPermission() {
  message.info('新增权限功能待开发')
  // TODO: 打开新增权限弹窗
}

// 编辑权限
function handleEditPermission(record: PermissionListItem) {
  message.info(`编辑权限: ${record.name}`)
  // TODO: 打开编辑权限弹窗
}

// 删除权限
function handleDeletePermission(record: PermissionListItem) {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除权限 "${record.name}" 吗？删除后无法恢复。`,
    onOk: async () => {
      try {
        await deletePermission(record.code)
        message.success('删除成功')
        await refresh()
      } catch (error) {
        message.error('删除失败')
      }
    }
  })
}
</script>

<style lang="scss" scoped>
.permission-management {
  background-color: #fff;
}
</style>
