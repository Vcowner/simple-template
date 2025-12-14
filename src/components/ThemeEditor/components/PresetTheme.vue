<!--
 * @Author: liaokt
 * @Description: 预设主题选择组件
 * @Date: 2025-12-04
-->
<template>
  <div class="preset-theme">
    <a-radio-group :model-value="modelValue" @change="handleChange">
      <a-row :gutter="[16, 16]">
        <a-col v-for="preset in availablePresets" :key="preset" :xs="12" :sm="8" :md="6">
          <a-radio-button :value="preset" class="preset-theme__item">
            <div class="preset-theme__preview">
              <div
                class="preset-theme__color"
                :style="{ backgroundColor: getPresetColor(preset) }"
              ></div>
              <span class="preset-theme__name">{{
                themeStore.getPresetThemeDisplayName(preset)
              }}</span>
            </div>
          </a-radio-button>
        </a-col>
      </a-row>
    </a-radio-group>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useThemeStore } from '@/store/modules/theme'
import type { PresetThemeName } from '@/config/theme'
import { getPresetTheme } from '@/config/theme'

interface Props {
  /** 当前选中的预设主题 */
  modelValue?: PresetThemeName
}

interface Emits {
  (e: 'update:modelValue', value: PresetThemeName): void
  (e: 'change', value: PresetThemeName): void
}

withDefaults(defineProps<Props>(), {
  modelValue: 'light-blue'
})

const emit = defineEmits<Emits>()

const themeStore = useThemeStore()

const availablePresets = computed(() => themeStore.getAvailablePresetThemes())

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

// 获取预设主题的主色
const getPresetColor = (preset: PresetThemeName): string => {
  const theme = getPresetTheme(preset)
  return (theme.token?.colorPrimary as string) || '#2f54eb'
}

// 处理变化
const handleChange = (e: any) => {
  const value = e.target.value as PresetThemeName
  emit('update:modelValue', value)
  emit('change', value)
}
</script>

<style lang="scss" scoped>
.preset-theme {
  padding: 16px 0;

  &__item {
    width: 100%;
    height: auto;
    padding: 12px;
    border-radius: 8px;
    transition: all 0.3s ease;

    &:hover {
      background-color: rgb(0 0 0 / 4%);
    }
  }

  &__preview {
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: center;
  }

  &__color {
    width: 100%;
    height: 40px;
    border: 1px solid rgb(0 0 0 / 10%);
    border-radius: 4px;
  }

  &__name {
    font-size: 12px;
    color: rgb(0 0 0 / 85%);
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
