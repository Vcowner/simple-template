<!--
 * @Author: liaokt
 * @Description: 紧凑模式设置组件
 * @Date: 2025-12-04
-->
<template>
  <div class="density-selector">
    <a-radio-group :value="modelValue" style="width: 100%" @change="handleChange">
      <a-radio
        v-for="density in densities"
        :key="density.value"
        :value="density.value"
        class="density-selector__item"
      >
        {{ density.label }}
      </a-radio>
    </a-radio-group>
  </div>
</template>

<script setup lang="ts">
export type DensityMode = 'default' | 'compact'

interface Props {
  /** 当前选中的模式 */
  modelValue?: DensityMode
}

interface Emits {
  (e: 'update:modelValue', value: DensityMode): void
  (e: 'change', value: DensityMode): void
}

withDefaults(defineProps<Props>(), {
  modelValue: 'default'
})

const emit = defineEmits<Emits>()

const densities: Array<{ value: DensityMode; label: string }> = [
  { value: 'default', label: '标准' },
  { value: 'compact', label: '紧凑' }
]

// 处理变化
const handleChange = (e: any) => {
  const value = e.target.value as DensityMode
  emit('update:modelValue', value)
  emit('change', value)
}
</script>

<style lang="scss" scoped>
.density-selector {
  padding: 8px 0;

  &__item {
    margin-right: 16px;
  }
}
</style>
