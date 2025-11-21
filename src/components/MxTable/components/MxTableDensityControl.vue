<script setup lang="ts">
import { computed } from 'vue'
import { ColumnHeightOutlined } from '@ant-design/icons-vue'
import type { MenuInfo } from 'ant-design-vue/es/menu/src/interface'

type Density = 'large' | 'middle' | 'small'

const props = withDefaults(
  defineProps<{
    modelValue?: Density
  }>(),
  {
    modelValue: 'middle'
  }
)

const emit = defineEmits<{
  'update:modelValue': [Density]
}>()

const density = computed({
  get: () => props.modelValue || 'middle',
  set: value => emit('update:modelValue', value)
})

const handleMenuClick = ({ key }: MenuInfo) => {
  density.value = key as Density
}
</script>

<template>
  <a-dropdown trigger="click" placement="bottomRight">
    <span class="mx-table-action-btn">
      <ColumnHeightOutlined />
    </span>
    <template #overlay>
      <a-menu :selected-keys="[density]" @click="handleMenuClick">
        <a-menu-item key="large">宽松</a-menu-item>
        <a-menu-item key="middle">中等</a-menu-item>
        <a-menu-item key="small">紧凑</a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<style scoped>
.mx-table-action-btn {
  display: inline-flex;
  align-items: center;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.3s;
  color: var(--ant-text-color-secondary, #595959);
  cursor: pointer;
}

.mx-table-action-btn:hover {
  color: #1677ff;
  background-color: rgba(22, 119, 255, 0.08);
}

.mx-table-action-btn :deep(svg) {
  font-size: 16px;
  transition: color 0.3s;
}
</style>
