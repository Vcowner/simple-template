<!--
 * @Author: liaokt
 * @Description: 主题色选择组件
 * @Date: 2025-12-04
-->
<template>
  <div class="color-selector">
    <div class="color-selector__list">
      <div
        v-for="color in colors"
        :key="color.value"
        :class="[
          'color-selector__item',
          { 'color-selector__item--active': modelValue === color.value }
        ]"
        :style="{ backgroundColor: color.value }"
        @click="handleSelect(color.value)"
      >
        <CheckOutlined v-if="modelValue === color.value" class="color-selector__check" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CheckOutlined } from '@ant-design/icons-vue'

interface Props {
  /** 当前选中的颜色 */
  modelValue?: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'change', value: string): void
}

withDefaults(defineProps<Props>(), {
  modelValue: '#2f54eb'
})

const emit = defineEmits<Emits>()

const colors = [
  { value: '#2f54eb', label: '蓝色' },
  { value: '#ff4d4f', label: '红色' },
  { value: '#fa8c16', label: '橙色' },
  { value: '#fadb14', label: '黄色' },
  { value: '#13c2c2', label: '青色' },
  { value: '#52c41a', label: '绿色' },
  { value: '#1890ff', label: '天蓝色' },
  { value: '#722ed1', label: '紫色' }
]

// 处理选择
const handleSelect = (value: string) => {
  emit('update:modelValue', value)
  emit('change', value)
}
</script>

<style lang="scss" scoped>
.color-selector {
  padding: 8px 0;

  &__list {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }

  &__item {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    cursor: pointer;
    border: 2px solid transparent;
    border-radius: 4px;
    transition: all 0.3s ease;

    &:hover {
      box-shadow: 0 2px 8px rgb(0 0 0 / 15%);
      transform: scale(1.1);
    }

    &--active {
      border-color: rgb(0 0 0 / 20%);
      box-shadow:
        0 0 0 2px rgb(255 255 255 / 100%),
        0 0 0 4px rgb(0 0 0 / 10%);
    }
  }

  &__check {
    font-size: 16px;
    color: #fff;
    filter: drop-shadow(0 1px 2px rgb(0 0 0 / 30%));
  }
}
</style>
