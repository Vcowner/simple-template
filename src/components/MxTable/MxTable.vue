<!--
 * @Author: liaokt
 * @Description: 
 * @Date: 2025-11-18 09:43:26
 * @LastEditors: liaokt
 * @LastEditTime: 2025-11-21 17:02:03
-->
<template>
  <div ref="tableContainerRef" class="configurable-table">
    <!-- 搜索和操作工具栏 -->
    <MxTableToolbar
      :search-list="searchList"
      :operate-list="operateList || []"
      @search="handleSearch"
      @reset="handleReset"
    >
      <!-- 列设置按钮和表格密度设置 -->
      <template v-if="enableColumnFilter" #rightActions>
        <div class="table-action-buttons">
          <MxTableDensityControl v-model="tableDensity" />
          <MxTableColumnConfigurator v-model="columnConfigState" :columns="columnMetas" />
        </div>
      </template>
    </MxTableToolbar>

    <!-- 表格容器 -->
    <div class="table-wrapper">
      <!-- 表格标题 -->
      <div v-if="tableTitle" class="table-header">
        <div class="table-title">{{ tableTitle }}</div>
      </div>

      <!-- 表格主体 -->
      <a-table
        :columns="configuredColumns"
        :data-source="dataSource"
        :pagination="paginationConfig"
        :row-key="rowKey || 'id'"
        :loading="loading"
        :bordered="bordered"
        :size="tableDensity"
        :row-selection="selectionConfig"
        :scroll="mergedScroll"
        v-bind="$attrs"
        @change="handleTableChange"
      >
      </a-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, h, ref, toRefs, watch } from 'vue'
import type { TableConfig } from './table'
import { formatDate, formatTime } from '@/utils/time/time'
import { getStatusConfigByValue } from '@/constants/status'
import MxTableToolbar from '@/components/MxTableToolbar/MxTableToolbar.vue'
import MxTableDensityControl from './components/MxTableDensityControl.vue'
import MxTableColumnConfigurator from './components/MxTableColumnConfigurator.vue'
import { useSize } from '@/hooks'

interface Props extends TableConfig {
  /** 是否启用列过滤功能 */
  enableColumnFilter?: boolean
  /** 默认隐藏的列（通过 key 或 dataIndex 指定） */
  defaultHiddenColumns?: (string | number)[]
  /** 表格标题 */
  tableTitle?: string
}

const props = withDefaults(defineProps<Props>(), {
  enableColumnFilter: true,
  defaultHiddenColumns: () => [],
  tableTitle: ''
})

// 解构 props 保持响应式
const {
  columns,
  dataSource,
  pagination,
  rowKey,
  loading,
  bordered,
  size,
  searchList,
  operateList,
  scroll
} = toRefs(props)

// 表格容器引用
const tableContainerRef = ref<HTMLElement | null>(null)

// 监听容器尺寸变化
const containerSize = useSize(
  computed(() => tableContainerRef.value),
  {
    immediate: true,
    listenWindowResize: false
  }
)

// 计算表格滚动高度（容器高度 - 工具栏高度 - 分页高度 - 缓冲）
const calculatedScrollHeight = computed(() => {
  const baseHeight = containerSize.value.height
  if (baseHeight === 0) return undefined // 如果容器高度为0，不设置滚动高度

  const toolbarHeight = searchList.value?.length ? 80 : 0 // 工具栏高度
  const paginationHeight = pagination.value ? 60 : 0 // 分页高度
  const buffer = 80 // 缓冲空间

  const calculatedHeight = baseHeight - toolbarHeight - paginationHeight - buffer
  return Math.max(calculatedHeight, 300) // 最小高度 300px
})

// 合并滚动配置：如果外部传入了 scroll，则合并；否则使用计算的高度
const mergedScroll = computed(() => {
  if (scroll.value) {
    // 如果外部传入了 scroll，合并 y 轴高度（优先使用计算的高度）
    return {
      ...scroll.value,
      y: calculatedScrollHeight.value || scroll.value.y
    }
  }
  // 如果没有传入 scroll，使用计算的高度
  if (calculatedScrollHeight.value) {
    return {
      y: calculatedScrollHeight.value
    }
  }
  return undefined
})

// 获取选择配置
const selection = computed(() => props.rowSelection)

// 定义事件
const emit = defineEmits<{
  paginationChange: [pagination: { current: number; pageSize: number }]
  selectionChange: [selectedRowKeys: string[], selectedRows: any[]]
  search: [params: Record<string, any>, reset?: boolean]
  reset: [params: any]
}>()

// 通用文本渲染函数（带 Tooltip 和省略号）
const renderTextWithTooltip = (text: string, maxLength: number = 20) => {
  if (!text) return h('span', '-')

  if (text.length > maxLength) {
    return h(
      'a-tooltip',
      {
        title: text,
        placement: 'topLeft'
      },
      {
        default: () =>
          h(
            'span',
            {
              style: {
                display: 'inline-block',
                maxWidth: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }
            },
            text
          )
      }
    )
  }

  return h('span', text)
}

// 列值渲染函数
const renderColumnValue = (type: string, text: string, options?: any[], column?: any) => {
  switch (type) {
    case 'text':
      return renderTextWithTooltip(text)

    case 'tag':
      return text
        ? h('a-tag', { color: column?.color || 'default' }, { default: () => text })
        : h('span', '-')

    case 'status': {
      const statusConfig = getStatusConfigByValue(Number.parseInt(text))
      const status = options?.find((opt: any) => opt.value === text)
      return h('a-badge', {
        color: statusConfig.color,
        text: status?.label || '-'
      })
    }

    case 'date':
      return h('span', formatDate(text))

    case 'dateTime':
      return h('span', formatTime(text))

    case 'select': {
      const option = options?.find((opt: any) => opt.value === text)
      const displayText = option?.label || '-'
      return renderTextWithTooltip(displayText)
    }

    default:
      return renderTextWithTooltip(text)
  }
}

// 列配置处理
const getColumnKey = (column: any, index: number): string | number => {
  if (column.key !== undefined && column.key !== null) return column.key
  if (column.dataIndex !== undefined && column.dataIndex !== null) return column.dataIndex
  return `__index_${index}`
}

const getColumnTitleText = (column: any, index: number) => {
  if (typeof column.title === 'string' || typeof column.title === 'number') {
    return String(column.title)
  }
  if (column.dataIndex) return column.dataIndex
  return `列${index + 1}`
}

const processedColumns = computed(() => {
  return columns.value.map((column: any) => {
    const { type, options, color, customRender, ...columnConfig } = column

    if (type && !['custom'].includes(type)) {
      if (customRender) {
        columnConfig.customRender = customRender
      } else {
        columnConfig.customRender = ({ text }: { text: any }) =>
          renderColumnValue(type, text, options, { ...column, color })
      }
    } else if (type === 'custom' && customRender) {
      columnConfig.customRender = customRender
    }

    return columnConfig
  })
})

// ==================== 列过滤与密度控制 ====================

/** 表格密度状态 - 使用 props.size 或默认为 'middle' */
const tableDensity = ref<'large' | 'middle' | 'small'>(
  (size.value as 'large' | 'middle' | 'small') || 'middle'
)

type ColumnConfigState = {
  order: (string | number)[]
  fixedMap: Record<string | number, 'left' | 'right' | undefined>
  visible: (string | number)[]
}

const columnMetas = computed(() => {
  return processedColumns.value.map((column: any, index: number) => ({
    key: getColumnKey(column, index),
    title: getColumnTitleText(column, index),
    fixed: column.fixed as 'left' | 'right' | undefined
  }))
})

const buildInitialConfig = (): ColumnConfigState => {
  const metas = columnMetas.value
  return {
    order: metas.map(meta => meta.key),
    fixedMap: metas.reduce(
      (acc, meta) => {
        acc[meta.key] = meta.fixed
        return acc
      },
      {} as Record<string | number, 'left' | 'right' | undefined>
    ),
    visible: metas.map(meta => meta.key)
  }
}

const columnConfigState = ref<ColumnConfigState>(buildInitialConfig())

watch(
  columnMetas,
  metas => {
    columnConfigState.value = {
      order: metas.map(meta => meta.key),
      fixedMap: metas.reduce(
        (acc, meta) => {
          acc[meta.key] = columnConfigState.value.fixedMap[meta.key] ?? meta.fixed
          return acc
        },
        {} as Record<string | number, 'left' | 'right' | undefined>
      ),
      visible: metas.map(meta => meta.key)
    }
  },
  { immediate: true }
)

const configuredColumns = computed(() => {
  if (!props.enableColumnFilter) return processedColumns.value

  const columnsMap = new Map(
    processedColumns.value.map((column: any, index: number) => [
      getColumnKey(column, index),
      column
    ])
  )

  return columnConfigState.value.order
    .map(key => {
      const column = columnsMap.get(key)
      if (!column) return null
      const fixed = columnConfigState.value.fixedMap[key]
      if (fixed) {
        column.fixed = fixed
      } else {
        delete column.fixed
      }
      if (!columnConfigState.value.visible.includes(key) && !column.fixed) return null
      return column
    })
    .filter((column): column is any => !!column)
})

// 分页配置
const paginationConfig = computed(() => {
  if (!pagination.value) return false

  const {
    current,
    pageSize,
    total,
    showSizeChanger = true,
    showQuickJumper = false
  } = pagination.value

  return {
    current,
    pageSize,
    total,
    showSizeChanger,
    showQuickJumper,
    showTotal: (total: number) => `共 ${total} 条`
  }
})

// 内部选中状态
const internalSelectedRowKeys = ref<string[]>(
  (selection.value?.selectedRowKeys || []).map(key => String(key))
)

// 选择配置
const selectionConfig = computed(() => {
  if (!selection.value) return undefined

  return {
    ...selection.value,
    selectedRowKeys: internalSelectedRowKeys.value,
    onChange: (selectedRowKeys: any[], selectedRows: any[]) => {
      internalSelectedRowKeys.value = selectedRowKeys.map(key => String(key))
      emit('selectionChange', selectedRowKeys, selectedRows)
      selection.value?.onChange?.(selectedRowKeys, selectedRows)
    }
  }
})

// 事件处理函数
const handleTableChange = (pagination: any, filters: any, sorter: any, extra?: any) => {
  props.onChange?.(pagination, filters, sorter, extra)

  if (pagination) {
    emit('paginationChange', {
      current: pagination.current,
      pageSize: pagination.pageSize
    })
  }
}

const handleSearch = (params: Record<string, any>, reset?: boolean) => {
  emit('search', params, reset)
}

const handleReset = (params: any) => {
  emit('reset', params)
}
</script>

<style scoped>
.configurable-table {
  width: 100%;
}

.table-wrapper {
  background: #fff;
  border-radius: 4px;
}

.table-header-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 16px 0;
  margin-bottom: 0;
}

.table-header {
  flex: 1;
}

.table-title {
  font-size: 16px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
  margin: 0;
}

.table-setting-button {
  display: flex;
  align-items: center;
  padding: 0 4px;
}

/* 带设置图标的列头容器 */
.column-header-with-setting {
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
}

.column-title-text {
  flex: 1;
  margin-right: auto;
}

/* 设置图标在列头中的样式 - 让它和筛选图标贴在一起 */
.table-action-buttons {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
</style>
