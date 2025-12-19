<!--
 * @Author: liaokt
 * @Description: 主题编辑器组件
 * @Date: 2025-12-04
-->
<template>
  <!-- 手柄：始终使用 fixed 定位，根据 drawer 状态动态调整位置 -->
  <Teleport to="body">
    <DrawerHandle
      :open="visible"
      :drawer-width="400"
      :drawer-ref="drawerRef"
      @click="handleToggleDrawer"
    />
  </Teleport>

  <a-drawer
    ref="drawerRef"
    v-model:open="visible"
    title="主题设置"
    width="400px"
    placement="right"
    :body-style="{ position: 'relative', overflow: 'visible' }"
    @close="handleCancel"
  >
    <a-space direction="vertical" :size="24" style="width: 100%">
      <!-- 整体风格设置 -->
      <MxTitle title="整体风格设置" size="middle">
        <StyleSelector v-model="selectedStyle" @change="handleStyleChange" />
      </MxTitle>

      <!-- 主题色 -->
      <MxTitle title="主题色" size="middle">
        <ColorSelector v-model="selectedColor" @change="handleColorChange" />
      </MxTitle>

      <!-- 紧凑模式 -->
      <MxTitle title="紧凑模式" size="middle">
        <DensitySelector v-model="selectedDensity" @change="handleDensityChange" />
      </MxTitle>

      <!-- 导航模式 -->
      <MxTitle title="导航模式" size="middle">
        <NavigationModeSelector
          v-model="selectedNavigationMode"
          @change="handleNavigationModeChange"
        />
      </MxTitle>
    </a-space>
  </a-drawer>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useThemeStore } from '@/store/modules/theme'
import { useAppStore } from '@/store/modules/app'
import type { ThemeMode, DensityMode } from '@/store/modules/theme'
import type { NavigationMode } from '@/store/modules/app'
import type { PresetThemeName } from '@/config/theme'
import { presetThemes } from '@/config/theme'
import { message } from 'ant-design-vue'
import DrawerHandle from './components/DrawerHandle.vue'
import StyleSelector from './components/StyleSelector.vue'
import ColorSelector from './components/ColorSelector.vue'
import DensitySelector from './components/DensitySelector.vue'
import NavigationModeSelector from './components/NavigationModeSelector.vue'
import { MxTitle } from '@/components/MxTitle'

interface Props {
  open?: boolean
}

interface Emits {
  (e: 'update:open', value: boolean): void
  (e: 'close'): void
}

const props = withDefaults(defineProps<Props>(), {
  open: false
})

const emit = defineEmits<Emits>()

const themeStore = useThemeStore()
const appStore = useAppStore()

const visible = computed({
  get: () => props.open,
  set: val => emit('update:open', val)
})

// 抽屉元素引用
const drawerRef = ref<InstanceType<(typeof import('ant-design-vue'))['Drawer']> | null>(null)

// 使用 computed 来安全访问 store 的值
const currentPresetThemeName = computed(() => themeStore.presetThemeName)

// 从预设主题名称中提取风格
const extractStyle = (presetName: PresetThemeName): ThemeMode => {
  return presetName.startsWith('dark') ? 'dark' : 'light'
}

// 暗色主题颜色值到浅色主题颜色值的映射（用于在颜色选择器中显示）
const darkToLightColorMap: Record<string, string> = {
  '#177ddc': '#2f54eb', // 暗色蓝色 -> 浅色蓝色
  '#9254de': '#722ed1' // 暗色紫色 -> 浅色紫色
  // 绿色和橙色在暗色和浅色主题中相同，不需要映射
}

// 浅色主题颜色值到暗色主题颜色值的映射（用于在暗色主题下应用颜色）
const lightToDarkColorMap: Record<string, string> = {
  '#2f54eb': '#177ddc', // 浅色蓝色 -> 暗色蓝色
  '#722ed1': '#9254de' // 浅色紫色 -> 暗色紫色
  // 绿色和橙色在暗色和浅色主题中相同，不需要映射
}

// 从 store 中获取当前实际的主题色，并映射到颜色选择器中显示的颜色值
const getCurrentThemeColor = (): string => {
  const color = themeStore.themeConfig.token?.colorPrimary
  const actualColor = (typeof color === 'string' ? color : '#2f54eb') || '#2f54eb'

  // 如果是暗色主题的颜色值，映射到对应的浅色颜色值用于显示
  return darkToLightColorMap[actualColor] || actualColor
}

// 根据当前风格，将颜色选择器中的颜色值转换为实际应用的颜色值
const getActualColorForStyle = (displayColor: string, style: ThemeMode): string => {
  // 如果是暗色主题，需要将浅色颜色值映射到暗色颜色值
  if (style === 'dark') {
    return lightToDarkColorMap[displayColor] || displayColor
  }
  return displayColor
}

// 根据风格和颜色组合生成预设主题名称或使用自定义主题
const combineStyleAndColor = (style: ThemeMode, color: string): void => {
  // color 是颜色选择器中显示的颜色值（浅色主题的颜色值）
  // 需要先转换为实际应用的颜色值
  const actualColor = getActualColorForStyle(color, style)

  // 颜色值到颜色名称的映射（使用浅色主题的颜色值作为键）
  const colorMap: Record<string, string> = {
    '#2f54eb': 'blue', // 浅色蓝色（暗色主题会映射为 #177ddc）
    '#52c41a': 'green', // 绿色（暗色和浅色相同）
    '#722ed1': 'purple', // 浅色紫色（暗色主题会映射为 #9254de）
    '#fa8c16': 'orange' // 橙色（暗色和浅色相同）
  }

  const colorName = colorMap[color]

  // 如果有对应的颜色名称，检查是否存在预设主题
  if (colorName) {
    const presetName = `${style}-${colorName}` as PresetThemeName
    // 检查预设主题是否存在（因为某些颜色可能没有暗色版本，如 dark-orange）
    if (presetName in presetThemes) {
      // 如果存在预设主题，使用预设主题（会清除自定义参数）
      themeStore.setPresetTheme(presetName)
      // 确保清除自定义参数，只使用预设主题配置
      themeStore.resetCustomThemeParams()
    } else {
      // 如果不存在预设主题（如 dark-orange），使用自定义主题参数
      // 先设置基础预设主题（保持风格一致）
      const basePresetName = `${style}-blue` as PresetThemeName
      themeStore.setPresetTheme(basePresetName)
      // 然后设置自定义颜色参数（使用实际颜色值）
      themeStore.setCustomThemeParams({ colorPrimary: actualColor })
    }
  } else {
    // 如果没有对应的预设主题，使用自定义主题参数
    // 先设置基础预设主题（保持风格一致）
    const basePresetName = `${style}-blue` as PresetThemeName
    themeStore.setPresetTheme(basePresetName)
    // 然后设置自定义颜色参数（使用实际颜色值）
    themeStore.setCustomThemeParams({ colorPrimary: actualColor })
  }
}

// 初始化风格和颜色
const initialStyle = extractStyle(currentPresetThemeName.value || 'light-blue')
const initialColor = getCurrentThemeColor()

const selectedStyle = ref<ThemeMode>(initialStyle)
const selectedColor = ref<string>(initialColor)
const selectedDensity = ref<DensityMode>(themeStore.densityMode)
const selectedNavigationMode = ref<NavigationMode>(appStore.navigationMode)

// 主题色（用于样式绑定）
const primaryColor = computed(() => {
  const color = themeStore.themeConfig.token?.colorPrimary
  return (typeof color === 'string' ? color : '#2f54eb') || '#2f54eb'
})

const primaryColorShadow = computed(() => {
  const color = primaryColor.value
  // 简单的颜色透明度处理
  if (color.startsWith('#')) {
    const r = parseInt(color.slice(1, 3), 16)
    const g = parseInt(color.slice(3, 5), 16)
    const b = parseInt(color.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, 0.2)`
  }
  return 'rgba(47, 84, 235, 0.2)'
})

// 监听预设主题和主题配置变化，同步更新风格和颜色
watch(
  [currentPresetThemeName, () => themeStore.themeConfig.token?.colorPrimary],
  () => {
    if (currentPresetThemeName.value) {
      selectedStyle.value = extractStyle(currentPresetThemeName.value)
      selectedColor.value = getCurrentThemeColor()
    }
  },
  { immediate: true, deep: true }
)

// 监听紧凑模式变化，同步更新选中状态
watch(
  () => themeStore.densityMode,
  newDensity => {
    selectedDensity.value = newDensity
  },
  { immediate: true }
)

// 监听导航模式变化，同步更新选中状态
watch(
  () => appStore.navigationMode,
  newMode => {
    selectedNavigationMode.value = newMode
  },
  { immediate: true }
)

// 处理风格变化
const handleStyleChange = (style: ThemeMode) => {
  combineStyleAndColor(style, selectedColor.value)
  message.success('风格已切换')
}

// 处理颜色变化
const handleColorChange = (color: string) => {
  combineStyleAndColor(selectedStyle.value, color)
  message.success('主题色已切换')
}

// 处理紧凑模式变化
const handleDensityChange = (density: DensityMode) => {
  themeStore.setDensityMode(density)
  message.success(density === 'compact' ? '已切换到紧凑模式' : '已切换到标准模式')
}

// 处理导航模式变化
const handleNavigationModeChange = (mode: NavigationMode) => {
  appStore.setNavigationMode(mode)
  const modeNames: Record<NavigationMode, string> = {
    'top-side': '顶部+侧边栏',
    side: '侧边栏',
    basic: '基础'
  }
  message.success(`已切换到${modeNames[mode]}模式`)
}

// 切换抽屉状态
const handleToggleDrawer = () => {
  visible.value = !visible.value
}

// 取消
const handleCancel = () => {
  // 恢复原始设置（从 store 中读取当前实际值）
  if (currentPresetThemeName.value) {
    selectedStyle.value = extractStyle(currentPresetThemeName.value)
    selectedColor.value = getCurrentThemeColor()
  }
  selectedDensity.value = themeStore.densityMode
  selectedNavigationMode.value = appStore.navigationMode
  visible.value = false
  emit('close')
}
</script>

<style lang="scss" scoped>
// 确保抽屉所有容器都允许溢出，以便手柄显示
:deep(.ant-drawer) {
  overflow: visible !important;
}

:deep(.ant-drawer-content) {
  overflow: visible !important;
}

// 确保 content-wrapper 有相对定位，以便手柄绝对定位
:deep(.ant-drawer-content-wrapper) {
  position: relative !important;
  overflow: visible !important;
}

// 确保 content 有相对定位
:deep(.ant-drawer-content) {
  position: relative !important;
  overflow: visible !important;
}

// 确保 wrapper-body 有相对定位
:deep(.ant-drawer-wrapper-body) {
  position: relative !important;
  overflow: visible !important;
}

// 确保抽屉内容区域有相对定位，以便手柄绝对定位
:deep(.ant-drawer-body) {
  position: relative !important;
  overflow: visible !important;
}

.theme-editor {
  &__footer {
    display: flex;
    justify-content: flex-end;
  }
}

:deep(.ant-radio-button-wrapper) {
  border: 1px solid #d9d9d9;
  border-radius: 8px;

  &.ant-radio-button-wrapper-checked {
    border-color: v-bind('primaryColor');
    box-shadow: 0 0 0 2px v-bind('primaryColorShadow');
  }
}
</style>
