/*
 * @Author: liaokt
 * @Description: 表格状态管理 Hook - 仿 ahooks useAntdTable 风格
 * @Date: 2025-09-25 10:20:00
 * @LastEditors: liaokt
 * @LastEditTime: 2025-11-26 09:47:24
 */
import { ref, computed, watch, type Ref, type ComputedRef } from 'vue'

// 数据类型定义
export type Data = { total: number; list: any[] }
export type Params = [
  {
    current: number
    pageSize: number
    filters?: any
    sorter?: any
    extra?: any
  },
  { [key: string]: any }
]

// 支持两种函数签名：
// 1. 标准格式：(pagination, searchParams) => Promise<Data>
// 2. 简化格式：(params) => Promise<any> - 会自动转换数据格式
type ServiceFunction<TData extends Data> =
  | ((
      pagination: { current: number; page_size: number },
      searchParams: Record<string, any>
    ) => Promise<TData>)
  | ((params?: Record<string, any>) => Promise<any>)

export interface UseTableOptions {
  /** 默认参数 */
  defaultParams?: any
  /** 默认页面大小 */
  defaultPageSize?: number
  /** 刷新依赖 */
  refreshDeps?: any[]
  /** 是否立即请求 */
  manual?: boolean
  /** 搜索参数格式化函数 */
  searchFormatter?: (params: any) => any
  /** 错误处理函数 */
  onError?: (error: Error) => void
  /** 成功回调 */
  onSuccess?: (data: any) => void
}

export interface UseTableResult<TData extends Data> {
  /** 表格属性 */
  tableProps: ComputedRef<{
    dataSource: TData['list']
    loading: boolean
    onChange: (pagination: any, filters?: any, sorter?: any, extra?: any) => void
    pagination: {
      current: number
      pageSize: number
      total: number
    }
  }>
  /** 搜索功能 */
  search: {
    submit: (params: Record<string, any>) => void
    reset: () => void
  }
  /** 数据源 */
  dataSource: Ref<TData['list']>
  /** 加载状态 */
  loading: Ref<boolean>
  /** 分页状态 */
  pagination: Ref<{
    current: number
    pageSize: number
    total: number
  }>
  /** 选中的行键 */
  selectedRowKeys: Ref<string[]>
  /** 选中的行数据 */
  selectedRows: Ref<any[]>
  /** 刷新 */
  refresh: () => Promise<void>
  /** 重新加载 */
  reload: () => Promise<void>
  /** 重置 */
  reset: () => void
}

export function useTable<TData extends Data>(
  service: ServiceFunction<TData>,
  options: UseTableOptions = {}
): UseTableResult<TData> {
  const {
    defaultParams,
    defaultPageSize = 10,
    refreshDeps = [],
    manual = true,
    searchFormatter,
    onError,
    onSuccess
  } = options

  // 状态
  const dataSource = ref<any[]>([]) as Ref<TData['list']>
  const loading = ref(false)
  const selectedRowKeys = ref<string[]>([])
  const selectedRows = ref<any[]>([])

  // 分页状态
  const pagination = ref({
    current: 1,
    pageSize: defaultPageSize,
    total: 0
  })

  // 搜索状态
  const searchParams = ref<any>(defaultParams || {})

  // 表格属性
  const tableProps = computed(() => ({
    dataSource: dataSource.value,
    loading: loading.value,
    onChange: (paginationParams: any) => {
      pagination.value.current = paginationParams.current
      pagination.value.pageSize = paginationParams.pageSize
      run()
    },
    pagination: {
      current: pagination.value.current,
      pageSize: pagination.value.pageSize,
      total: pagination.value.total
    }
  }))

  // 搜索功能
  const search = {
    submit: (params: Record<string, any>) => {
      pagination.value.current = 1
      searchParams.value = params
      run()
    },
    reset: () => {
      searchParams.value = {}
      pagination.value.current = 1
      run()
    }
  }

  // 请求数据
  const run = async () => {
    loading.value = true
    try {
      // 格式化搜索参数
      const formattedSearchParams = searchFormatter
        ? searchFormatter(searchParams.value)
        : searchParams.value

      // 构建请求参数
      const paginationParams = {
        current: pagination.value.current,
        pageSize: pagination.value.pageSize
      }

      // 检测函数签名：如果函数接受单个参数，则合并参数
      const params = {
        page: paginationParams.current,
        page_size: paginationParams.pageSize,
        ...formattedSearchParams
      }

      // 调用服务函数
      let result: any
      if (service.length === 0 || service.length === 1) {
        // 简化格式：接受单个参数对象
        result = await (service as (params?: Record<string, any>) => Promise<any>)(params)
      } else {
        // 标准格式：接受两个参数
        result = await (service as (pagination: any, searchParams: any) => Promise<TData>)(
          paginationParams,
          formattedSearchParams
        )
      }

      // 处理返回数据格式
      let finalResult: TData
      if (result && typeof result === 'object') {
        // 如果返回的是 { list, total } 格式，直接使用
        if ('list' in result && 'total' in result) {
          finalResult = result as TData
        }
        // 如果返回 { data: [], total } 这样的结构
        else if (Array.isArray((result as any).data) && 'total' in result) {
          finalResult = {
            list: (result as any).data,
            total: (result as any).total ?? (result as any).data.length
          } as TData
        }
        // 如果返回的是 { code, data } 格式（API 响应格式），需要转换
        else if ('data' in result && 'code' in result) {
          const data = result.data
          // 如果 data 是数组
          if (Array.isArray(data)) {
            finalResult = {
              list: data,
              total: data.length
            } as TData
          }
          // 如果 data 是分页对象 { list, total }
          else if (data && typeof data === 'object' && 'list' in data && 'total' in data) {
            finalResult = {
              list: data.list || [],
              total: data.total || 0
            } as TData
          }
          // 如果 data 是分页对象 { results, count }
          else if (data && typeof data === 'object' && 'results' in data && 'count' in data) {
            finalResult = {
              list: (data.results as any[]) || [],
              total: (data.count as number) || 0
            } as TData
          }
          // 其他情况，默认空列表
          else {
            finalResult = {
              list: [],
              total: 0
            } as unknown as TData
          }
        }
        // 其他格式，尝试直接使用
        else {
          finalResult = result as TData
        }
      } else {
        // 非对象类型，返回空列表
        finalResult = {
          list: [],
          total: 0
        } as unknown as TData
      }

      dataSource.value = finalResult.list as TData['list']
      pagination.value.total = finalResult.total

      // 成功回调
      onSuccess?.(finalResult)
    } catch (error) {
      console.error('请求数据失败:', error)
      // 错误处理回调
      onError?.(error as Error)
    } finally {
      loading.value = false
    }
  }

  // 刷新
  const refresh = async () => {
    await run()
  }

  // 重新加载
  const reload = async () => {
    pagination.value.current = 1
    await run()
  }

  // 重置
  const reset = () => {
    pagination.value.current = 1
    pagination.value.pageSize = defaultPageSize
    dataSource.value = [] as TData['list']
    selectedRowKeys.value = []
    selectedRows.value = []
    searchParams.value = {}
  }

  // 监听刷新依赖
  watch(
    refreshDeps,
    () => {
      run()
    },
    { deep: true }
  )

  // 立即请求
  if (!manual) {
    run()
  }

  return {
    tableProps,
    search,
    dataSource,
    loading,
    pagination,
    selectedRowKeys,
    selectedRows,
    refresh,
    reload,
    reset
  }
}
