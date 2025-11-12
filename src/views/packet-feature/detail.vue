<!--
 * @Author: liaokt
 * @Description: 包级特征管理详情页
 * @Date: 2025-11-11 18:00:00
 * @LastEditors: liaokt
 * @LastEditTime: 2025-11-12 17:30:23
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
import { TableColumnTypeEnum } from '@/components/MxTable/table'
import type { OperateButtonConfig } from '@/components/MxTableToolbar/type'
import type { TableActionItem } from '@/components/MxTableAction/MxTableAction.vue'
import { useTable } from '@/hooks'
import styles from './detail.module.scss'

const router = useRouter()
const pageTitle = '包级特征管理'

// 模拟 API 函数
const fetchPacketFeatureList = async (params: any) => {
  // 模拟延迟
  await new Promise(resolve => setTimeout(resolve, 500))

  // 模拟数据
  const mockData = [
    {
      id: 'PF001',
      featureId: 'PF001',
      packetSize: '1.5',
      tcpWindow: '8192',
      port: 502,
      mac: '00:1A:2B:3C:4D:5E',
      dns: 'modbus.device.local',
      httpStatus: 'HTTP/1.1 200 OK',
      deviceType: '智能电表',
      createdAt: '2024-01-15 10:30:00'
    },
    {
      id: 'PF002',
      featureId: 'PF002',
      packetSize: '2.1',
      tcpWindow: '16384',
      port: 80,
      mac: '00:2B:3C:4D:5E:6F',
      dns: '-',
      httpStatus: 'HTTP/1.1 404 Not Found',
      deviceType: '配电终端',
      createdAt: '2024-01-15 11:45:00'
    },
    {
      id: 'PF003',
      featureId: 'PF003',
      packetSize: '1.8',
      tcpWindow: '4096',
      port: 443,
      mac: '00:3C:4D:5E:6F:7A',
      dns: 'https.device.local',
      httpStatus: 'HTTP/1.1 200 OK',
      deviceType: '采集终端',
      createdAt: '2024-01-16 09:20:00'
    }
  ]

  // 模拟筛选
  let filteredData = [...mockData]
  if (params.featureId) {
    filteredData = filteredData.filter(item =>
      item.featureId.toLowerCase().includes(params.featureId.toLowerCase())
    )
  }
  if (params.deviceType && params.deviceType !== 'all') {
    filteredData = filteredData.filter(item => item.deviceType === params.deviceType)
  }
  if (params.mac) {
    filteredData = filteredData.filter(item =>
      item.mac.toLowerCase().includes(params.mac.toLowerCase())
    )
  }
  if (params.port) {
    filteredData = filteredData.filter(item => item.port === Number(params.port))
  }

  // 模拟分页
  const { current = 1, pageSize = 20 } = params
  const start = (current - 1) * pageSize
  const end = start + pageSize
  const list = filteredData.slice(start, end)

  return {
    list,
    total: filteredData.length
  }
}

// 使用 useTable hook
const { tableProps, search } = useTable(fetchPacketFeatureList, {
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
    key: 'featureId',
    title: '特征ID',
    dataIndex: 'featureId',
    width: 140,
    align: 'center' as const,
    fixed: 'left' as const,
    type: TableColumnTypeEnum.TEXT
  },
  {
    key: 'packetSize',
    title: '数据包大小(KB)',
    dataIndex: 'packetSize',
    width: 150,
    align: 'center' as const,
    type: TableColumnTypeEnum.TEXT
  },
  {
    key: 'tcpWindow',
    title: 'TCP窗口大小(字节)',
    dataIndex: 'tcpWindow',
    width: 180,
    align: 'center' as const,
    type: TableColumnTypeEnum.TEXT
  },
  {
    key: 'port',
    title: '端口号',
    dataIndex: 'port',
    width: 100,
    align: 'center' as const,
    type: TableColumnTypeEnum.TEXT
  },
  {
    key: 'mac',
    title: 'MAC地址',
    dataIndex: 'mac',
    width: 200,
    type: TableColumnTypeEnum.TEXT
  },
  {
    key: 'dns',
    title: 'DNS域名字符串',
    dataIndex: 'dns',
    width: 200,
    type: TableColumnTypeEnum.TEXT
  },
  {
    key: 'httpStatus',
    title: 'HTTP响应报文',
    dataIndex: 'httpStatus',
    width: 200,
    type: TableColumnTypeEnum.TAG,
    color: 'blue'
  },
  {
    key: 'deviceType',
    title: '关联设备类型',
    dataIndex: 'deviceType',
    width: 140,
    align: 'center' as const,
    type: TableColumnTypeEnum.TAG,
    color: 'blue'
  },
  {
    key: 'createdAt',
    title: '创建时间',
    dataIndex: 'createdAt',
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
    key: 'featureId',
    name: '特征ID',
    placeholder: '请输入特征ID',
    width: 200
  },
  {
    type: 'select' as const,
    key: 'deviceType',
    name: '设备类型',
    placeholder: '请选择设备类型',
    width: 220,
    options: [
      { key: 'all', value: '全部设备' },
      { key: '智能电表', value: '智能电表' },
      { key: '配电终端', value: '配电终端' },
      { key: '采集终端', value: '采集终端' }
    ]
  },
  {
    type: 'input' as const,
    key: 'mac',
    name: 'MAC地址',
    placeholder: '请输入MAC地址',
    isHidden: true // 高级搜索
  },
  {
    type: 'input' as const,
    key: 'port',
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
      message.info('新增包级特征')
    }
  },
  {
    label: '批量导入特征',
    buttonType: 'import',
    componentProps: {
      uploadType: 'button',
      accept: '.xlsx,.xls,.csv',
      action: '/api/packet-feature/import',
      maxSize: 10, // 最大文件大小 10MB
      multiple: false
    },
    onImport: fileList => {
      console.log('导入文件列表:', fileList)
      message.success('导入成功')
      // 刷新表格数据
      //   search.submit({})
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

const handleDetail = (record: any) => {
  message.info(`查看特征详情 ${record.featureId}`)
  console.log('查看特征详情', record)
  // 这里可以跳转到详情页或打开详情弹窗
}

const handleEdit = (record: any) => {
  message.info(`编辑特征 ${record.featureId}`)
  console.log('编辑特征', record)
}

const handleDelete = (record: any) => {
  message.success(`已删除特征 ${record.featureId}`)
  console.log('删除特征', record)
  // 这里可以调用 API 删除数据，然后刷新表格
  search.submit({})
}
</script>
