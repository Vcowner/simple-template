<!--
 * @Author: liaokt
 * @Description: 
 * @Date: 2025-11-12 17:44:21
 * @LastEditors: liaokt
 * @LastEditTime: 2025-12-02 09:47:09
-->
<!--
 * @Author: liaokt
 * @Description: 包级特征管理详情页
 * @Date: 2025-11-11 18:00:00
 * @LastEditors: liaokt
 * @LastEditTime: 2025-11-13 15:15:12
-->
<template>
  <div :class="styles['packet-feature-detail']">
    <a-page-header
      :class="styles['packet-feature-detail__header']"
      :title="pageTitle"
      sub-title="设备指纹库构建"
      @back="handleBack"
    >
      <template #backIcon>
        <ArrowLeftOutlined />
        返回首页
      </template>
      <template #extra>
        <a-tag color="blue">数据来源：设备指纹库 V1.0</a-tag>
      </template>
    </a-page-header>

    <div :class="styles['packet-feature-detail__content']">
      <a-card
        :class="styles['packet-feature-detail__container']"
        title="包级特征管理列表"
        :bordered="false"
      >
        <MxTable
          v-bind="{
            ...tableProps,
            columns,
            searchList,
            operateList,
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
import { message } from 'ant-design-vue'
import { ArrowLeftOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons-vue'
import MxTable from '@/components/MxTable/MxTable.vue'
import MxTableAction from '@/components/MxTableAction/MxTableAction.vue'
import AddFeatureModal from './components/AddFeatureModal.vue'
import FeatureDetailModal from './components/FeatureDetailModal.vue'
import { useModalController } from '@/components/MxModal'
import { TableColumnTypeEnum } from '@/components/MxTable/table'
import type { OperateButtonConfig } from '@/components/MxTableToolbar/type'
import type { TableActionItem } from '@/components/MxTableAction/MxTableAction.vue'
import { useTable } from '@/hooks'
import { useRequest } from '@/hooks/useRequest'
import { deletePacketFeature } from '@/api'
import { DEVICE_TYPE_OPTIONS, DEVICE_TYPE_DICT, DeviceType } from './dictkey'
import styles from './detail.module.scss'

const router = useRouter()
const pageTitle = '包级特征管理'

// Mock 数据生成函数
const generateMockData = (page: number, pageSize: number, searchParams: Record<string, any>) => {
  // 生成所有可能的 mock 数据（模拟数据库）
  const allMockData: any[] = []
  const deviceTypes = [
    DeviceType.SMART_METER,
    DeviceType.DISTRIBUTION_TERMINAL,
    DeviceType.COLLECTOR,
    DeviceType.OTHER
  ]

  for (let i = 1; i <= 100; i++) {
    const deviceType = deviceTypes[Math.floor(Math.random() * deviceTypes.length)]
    allMockData.push({
      id: i,
      feature_id: `FEATURE_${String(i).padStart(6, '0')}`,
      packet_size: Math.floor(Math.random() * 1000) + 100,
      tcp_window_size: Math.floor(Math.random() * 65535) + 1024,
      port_number: Math.floor(Math.random() * 65535) + 1,
      mac_address: Array.from({ length: 6 }, () =>
        Math.floor(Math.random() * 256)
          .toString(16)
          .padStart(2, '0')
      )
        .join(':')
        .toUpperCase(),
      dns_domain: `example${i}.com`,
      http_response: `HTTP/1.1 200 OK ${i}`,
      device_type: deviceType,
      device_type_display: DEVICE_TYPE_DICT[deviceType],
      created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
    })
  }

  // 应用搜索过滤
  let filteredData = allMockData
  if (searchParams.feature_id) {
    filteredData = filteredData.filter(item =>
      item.feature_id.toLowerCase().includes(searchParams.feature_id.toLowerCase())
    )
  }
  if (searchParams.device_type && searchParams.device_type !== 'all') {
    filteredData = filteredData.filter(item => item.device_type === searchParams.device_type)
  }
  if (searchParams.mac_address) {
    filteredData = filteredData.filter(item =>
      item.mac_address.toLowerCase().includes(searchParams.mac_address.toLowerCase())
    )
  }
  if (searchParams.port_number) {
    filteredData = filteredData.filter(item =>
      String(item.port_number).includes(String(searchParams.port_number))
    )
  }

  // 分页
  const total = filteredData.length
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const list = filteredData.slice(start, end)

  return {
    list,
    total
  }
}

// Mock 接口函数
const mockGetPacketFeaturesList = async (params?: Record<string, any>) => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 300))

  const page = params?.page || 1
  const pageSize = params?.page_size || 20
  const searchParams = { ...params }
  delete searchParams.page
  delete searchParams.page_size

  return generateMockData(page, pageSize, searchParams)
}

// 使用命令式 API 创建 Modal 控制器
const addFeatureModal = useModalController(AddFeatureModal)
const featureDetailModal = useModalController(FeatureDetailModal)

// 使用 useTable hook
const { tableProps, search } = useTable(mockGetPacketFeaturesList, {
  defaultPageSize: 20,
  manual: false, // 自动加载
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

// 表格列配置
const columns = ref([
  {
    key: 'feature_id',
    title: '特征ID',
    dataIndex: 'feature_id',
    width: 140,
    fixed: 'left' as const,
    type: TableColumnTypeEnum.TEXT
  },
  {
    key: 'packet_size',
    title: '数据包大小(KB)',
    dataIndex: 'packet_size',
    width: 150,
    align: 'center' as const,
    type: TableColumnTypeEnum.TEXT
  },
  {
    key: 'tcp_window_size',
    title: 'TCP窗口大小(字节)',
    dataIndex: 'tcp_window_size',
    width: 180,
    align: 'center' as const,
    type: TableColumnTypeEnum.TEXT
  },
  {
    key: 'port_number',
    title: '端口号',
    dataIndex: 'port_number',
    width: 100,
    align: 'center' as const,
    type: TableColumnTypeEnum.TEXT
  },
  {
    key: 'mac_address',
    title: 'MAC地址',
    dataIndex: 'mac_address',
    width: 200,
    type: TableColumnTypeEnum.TEXT
  },
  {
    key: 'dns_domain',
    title: 'DNS域名字符串',
    dataIndex: 'dns_domain',
    width: 200,
    type: TableColumnTypeEnum.TEXT
  },
  {
    key: 'http_response',
    title: 'HTTP响应报文',
    dataIndex: 'http_response',
    width: 200,
    type: TableColumnTypeEnum.TAG,
    color: 'blue'
  },
  {
    key: 'device_type_display',
    title: '关联设备类型',
    dataIndex: 'device_type_display',
    width: 140,
    align: 'center' as const,
    type: TableColumnTypeEnum.TAG,
    color: 'blue'
  },
  {
    key: 'created_at',
    title: '创建时间',
    dataIndex: 'created_at',
    width: 180,
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

// 搜索配置
const searchList = ref([
  {
    type: 'input' as const,
    key: 'feature_id',
    name: '特征ID',
    placeholder: '请输入特征ID',
    width: 200
  },
  {
    type: 'select' as const,
    key: 'device_type',
    name: '设备类型',
    placeholder: '请选择设备类型',
    width: 220,
    options: DEVICE_TYPE_OPTIONS
  },
  {
    type: 'input' as const,
    key: 'mac_address',
    name: 'MAC地址',
    placeholder: '请输入MAC地址',
    isHidden: true // 高级搜索
  },
  {
    type: 'input' as const,
    key: 'port_number',
    name: '端口号',
    placeholder: '请输入端口号',
    isHidden: true // 高级搜索
  }
])

// 操作按钮配置
const operateList = ref<OperateButtonConfig[]>([
  {
    label: '新增包级特征',
    type: 'primary' as const,
    componentProps: {
      iconType: 'add'
    },
    onClick: () => {
      handleAdd()
    }
  },
  {
    label: '批量导入特征',
    buttonType: 'import',
    componentProps: {
      uploadType: 'modal',
      accept: '.xlsx,.xls,.csv',
      action: '/api/packet-features/batch_import/',
      maxSize: 10, // 最大文件大小 10MB
      multiple: false,
      downloadTemplate: {
        url: '/api/packet-features/download_template',
        filename: '包级特征管理导入模版.xlsx',
        text: '下载模板'
      }
    },
    onImport: fileList => {
      console.log('导入文件列表:', fileList)
      message.success('导入成功')
      // 刷新表格数据
      search.submit({})
    },
    onImportChange: info => {
      // 只处理错误状态，成功状态由 onImport 处理
      if (info.file.status === 'error') {
        message.error('文件上传失败')
      }
    }
  }
])

// 事件处理
const handleBack = () => {
  router.push('/')
}

const handleSearch = (params: Record<string, any>, reset?: boolean) => {
  console.log('搜索参数:', params, '是否重置:', reset)
  if (reset) {
    search.reset()
  } else {
    search.submit(params)
  }
}

const handleReset = (params: any) => {
  console.log('重置参数:', params)
  search.reset()
}

// 打开特征详情弹窗
const handleDetail = (record: any) => {
  featureDetailModal.show({
    title: '特征详情',
    width: 600,
    data: record
  })
}

const handleEdit = async (record: any) => {
  try {
    // 打开弹窗，传入 id，弹窗会自动调用详情接口获取数据
    const result = await addFeatureModal.show({
      title: '编辑包级特征',
      width: 500,
      id: record.id, // 传入 id，用于判断是编辑模式
      type: 'edit'
    })

    if (result) {
      // 用户提交了表单，接口已在弹窗中调用，这里只需要刷新表格
      search.submit({})
    }
  } catch (error) {
    console.error('打开编辑弹窗失败:', error)
  }
}

// 使用 useRequest 创建删除功能
const { run: runDelete } = useRequest(deletePacketFeature, {
  manual: true,
  showMessage: true,
  successMessage: '删除成功',
  onSuccess: () => {
    // 删除成功后刷新表格
    search.submit({})
  },
  onError: error => {
    console.error('删除失败:', error)
  }
})

const handleDelete = (record: any) => {
  runDelete({ id: record.id })
}

// 打开新增特征弹框
const handleAdd = async () => {
  try {
    const result = await addFeatureModal.show({
      title: '新增包级特征',
      width: 500
    })

    if (result) {
      // 用户提交了表单，接口已在弹窗中调用，这里只需要刷新表格
      await handleAddSubmit()
    }
    // 如果 result 为 null，说明用户取消了操作，不需要处理
  } catch (error) {
    console.error('打开弹框失败:', error)
  }
}

// 新增特征提交
const handleAddSubmit = async () => {
  // 接口已在弹窗中调用，这里只需要刷新表格
  search.submit({})
}
</script>
