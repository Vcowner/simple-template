<!--
 * @Author: liaokt
 * @Description: 通用图表组件，基于 @antv/g2
 * @Date: 2025-12-15
-->
<template>
  <div :class="['mx-chart', customClass]" :style="containerStyle">
    <div ref="chartContainer" class="mx-chart__container"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { Chart } from '@antv/g2'
import type { MxChartProps, MxChartEmits } from './chartTypes'

/**
 * MxChart 通用图表组件
 * 基于 @antv/g2，支持多种图表类型，快速配置
 *
 * @example
 * ```vue
 * <!-- 柱状图 -->
 * <mx-chart
 *   type="column"
 *   :data="columnData"
 *   :config="{ xField: 'month', yField: 'value' }"
 *   height="300"
 * />
 *
 * <!-- 饼图 -->
 * <mx-chart
 *   type="pie"
 *   :data="pieData"
 *   :config="{ angleField: 'value', colorField: 'type' }"
 *   height="300"
 * />
 *
 * <!-- 折线图 -->
 * <mx-chart
 *   type="line"
 *   :data="lineData"
 *   :config="{ xField: 'date', yField: 'value', seriesField: 'category' }"
 *   height="300"
 * />
 * ```
 */
defineOptions({
  name: 'MxChart'
})

const props = withDefaults(defineProps<MxChartProps>(), {
  type: 'column',
  data: () => [],
  config: () => ({}),
  height: 300,
  width: undefined,
  autoFit: true,
  customClass: ''
})

const emit = defineEmits<MxChartEmits>()

const chartContainer = ref<HTMLDivElement>()
let chartInstance: Chart | null = null

/** 容器样式 */
const containerStyle = computed(() => {
  const style: Record<string, string> = {}
  if (props.width) {
    style.width = `${props.width}px`
  }
  if (props.height) {
    style.height = `${props.height}px`
  }
  return style
})

/** 初始化图表 */
const initChart = () => {
  if (!chartContainer.value) return

  // 销毁旧图表
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }

  // 创建新图表
  const chartOptions: any = {
    container: chartContainer.value,
    autoFit: props.autoFit,
    height: props.height
  }

  if (props.width) {
    chartOptions.width = props.width
  }

  // 合并用户自定义配置（但不包括 axis，axis 需要在渲染后单独设置）
  const userOptions = props.config?.options || {}
  const { axis, ...restOptions } = userOptions
  Object.assign(chartOptions, restOptions)

  chartInstance = new Chart(chartOptions)

  // 渲染图表
  renderChart()

  // 监听元素点击事件
  chartInstance.on('element:click', (ev: any) => {
    emit('elementClick', ev.data?.data || ev.data)
  })

  // 图表渲染完成
  chartInstance.on('afterrender', () => {
    emit('ready', chartInstance)
  })
}

/** 渲染图表 */
const renderChart = () => {
  if (!chartInstance || !props.data || props.data.length === 0) {
    if (chartInstance) {
      chartInstance.clear()
    }
    return
  }

  const { type } = props

  // 清空图表
  chartInstance.clear()

  // 根据图表类型渲染
  switch (type) {
    case 'column':
      renderColumn()
      break
    case 'bar':
      renderBar()
      break
    case 'line':
      renderLine()
      break
    case 'area':
      renderArea()
      break
    case 'pie':
      renderPie()
      break
    case 'scatter':
      renderScatter()
      break
    case 'gauge':
      renderGauge()
      break
    default:
      console.warn(`不支持的图表类型: ${type}`)
  }

  // 渲染
  chartInstance.render()
}

/** 渲染柱状图 */
const renderColumn = () => {
  if (!chartInstance) return
  const { xField = 'x', yField = 'y', seriesField, options } = props.config || {}

  const interval = chartInstance.interval().data(props.data).encode('x', xField).encode('y', yField)

  if (seriesField) {
    interval.encode('color', seriesField)
  }

  // 应用 tooltip 配置
  if (options?.tooltip) {
    interval.tooltip(options.tooltip)
  }
}

/** 渲染条形图 */
const renderBar = () => {
  if (!chartInstance) return
  const { xField = 'x', yField = 'y', seriesField, options } = props.config || {}

  const interval = chartInstance
    .interval()
    .data(props.data)
    .coordinate({ transform: [{ type: 'transpose' }] })
    .encode('x', yField)
    .encode('y', xField)

  if (seriesField) {
    interval.encode('color', seriesField)
  }

  // 应用 tooltip 配置
  if (options?.tooltip) {
    interval.tooltip(options.tooltip)
  }
}

/** 渲染折线图 */
const renderLine = () => {
  if (!chartInstance) return
  const { xField = 'x', yField = 'y', seriesField, options } = props.config || {}

  const line = chartInstance.line().data(props.data).encode('x', xField).encode('y', yField)

  if (seriesField) {
    line.encode('color', seriesField)
  }

  // 应用 tooltip 配置
  if (options?.tooltip) {
    line.tooltip(options.tooltip)
  }

  // 添加点
  const point = chartInstance
    .point()
    .data(props.data)
    .encode('x', xField)
    .encode('y', yField)
    .encode('color', seriesField)
    .axis(options?.axis)

  // 应用 tooltip 配置到点
  if (options?.tooltip) {
    point.tooltip(options.tooltip)
  }

  // 应用 scrollbar 配置
  if (options?.scrollbar) {
    point.scrollbar(options.scrollbar)
  }
}

/** 渲染面积图 */
const renderArea = () => {
  if (!chartInstance) return
  const { xField = 'x', yField = 'y', seriesField, options } = props.config || {}

  const area = chartInstance.area().data(props.data).encode('x', xField).encode('y', yField)

  if (seriesField) {
    area.encode('color', seriesField)
  }

  // 应用 tooltip 配置
  if (options?.tooltip) {
    area.tooltip(options.tooltip)
  }
}

/** 渲染饼图 */
const renderPie = () => {
  if (!chartInstance) return
  const { angleField = 'value', colorField = 'type', options } = props.config || {}

  const interval = chartInstance
    .interval()
    .data(props.data)
    .coordinate({ type: 'theta', outerRadius: 0.8 })
    .transform({ type: 'stackY' })
    .encode('y', angleField)
    .encode('color', colorField)
    .label({ text: colorField, position: 'outside' })

  // 应用 tooltip 配置（如果提供了自定义配置则使用，否则使用默认）
  if (options?.tooltip) {
    interval.tooltip(options.tooltip)
  } else {
    interval.tooltip({ channel: 'y' })
  }
}

/** 渲染散点图 */
const renderScatter = () => {
  if (!chartInstance) return
  const { xField = 'x', yField = 'y', seriesField, options } = props.config || {}

  const point = chartInstance.point().data(props.data).encode('x', xField).encode('y', yField)

  if (seriesField) {
    point.encode('color', seriesField)
  }

  // 应用 tooltip 配置
  if (options?.tooltip) {
    point.tooltip(options.tooltip)
  }
}

/** 渲染仪表盘 */
const renderGauge = () => {
  if (!chartInstance) return
  const { valueField = 'value', options } = props.config || {}

  // G2 5.x 中仪表盘需要特殊处理
  const gauge = chartInstance.gauge().data(props.data).encode('value', valueField)

  // 应用 tooltip 配置
  if (options?.tooltip) {
    gauge.tooltip(options.tooltip)
  }
}

// 监听数据变化
watch(
  () => [props.data, props.type, props.config],
  () => {
    nextTick(() => {
      if (chartInstance) {
        renderChart()
      }
    })
  },
  { deep: true }
)

// 监听尺寸变化
watch(
  () => [props.width, props.height],
  () => {
    if (chartInstance) {
      const width = props.width || chartInstance.options().width || 'auto'
      const height = props.height || chartInstance.options().height || 300
      if (typeof width === 'number') {
        chartInstance.changeSize(width, height)
      } else {
        // 如果宽度是 auto，重新初始化
        nextTick(() => {
          initChart()
        })
      }
    }
  }
)

onMounted(() => {
  nextTick(() => {
    initChart()
  })
})

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }
})
</script>

<style lang="scss" scoped>
.mx-chart {
  position: relative;
  width: 100%;

  &__container {
    width: 100%;
    height: 100%;
  }
}
</style>
