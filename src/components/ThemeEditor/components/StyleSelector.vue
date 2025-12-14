<!--
 * @Author: liaokt
 * @Description: 整体风格设置组件
 * @Date: 2025-12-04
-->
<template>
  <div class="style-selector">
    <a-radio-group :model-value="modelValue" style="width: 100%" @change="handleChange">
      <a-row :gutter="[12, 16]">
        <a-col v-for="style in styles" :key="style.value" :span="12">
          <a-radio-button :value="style.value" class="style-selector__item">
            <div class="style-selector__preview">
              <div
                class="style-selector__card"
                :class="[
                  `style-selector__card--${style.value}`,
                  { 'style-selector__card--checked': modelValue === style.value }
                ]"
              >
                <!-- 浅色风格预览 -->
                <svg
                  v-if="style.value === 'light'"
                  class="style-selector__preview-svg"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  <!-- 侧边栏 -->
                  <rect x="0" y="0" width="33" height="100" fill="#f5f5f5" />
                  <line
                    x1="33"
                    y1="0"
                    x2="33"
                    y2="100"
                    stroke="rgb(0 0 0 / 8%)"
                    stroke-width="0.5"
                  />
                  <!-- 主内容区 -->
                  <rect x="33" y="0" width="67" height="100" fill="#fff" />
                </svg>

                <!-- 暗色风格预览 -->
                <svg
                  v-else-if="style.value === 'dark'"
                  class="style-selector__preview-svg"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  <!-- 侧边栏 -->
                  <rect x="0" y="0" width="33" height="100" fill="#141414" />
                  <line
                    x1="33"
                    y1="0"
                    x2="33"
                    y2="100"
                    stroke="rgb(255 255 255 / 20%)"
                    stroke-width="0.5"
                  />
                  <!-- 主内容区 -->
                  <rect x="33" y="0" width="67" height="100" fill="#1f1f1f" />
                </svg>

                <!-- 选中状态图标 -->
                <div
                  v-if="modelValue === style.value"
                  class="style-selector__check"
                  :class="`style-selector__check--${style.value}`"
                >
                  <svg
                    viewBox="64 64 896 896"
                    focusable="false"
                    data-icon="check"
                    width="1em"
                    height="1em"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      d="M912 190h-69.9c-9.8 0-19.1 4.5-25.1 12.2L404.7 724.5 207 474a32 32 0 00-25.1-12.2H112c-6.7 0-10.4 7.7-6.3 12.9l273.9 347c12.8 16.2 37.4 16.2 50.3 0l488.4-618.9c4.1-5.1.4-12.8-6.3-12.8z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </a-radio-button>
        </a-col>
      </a-row>
    </a-radio-group>
  </div>
</template>

<script setup lang="ts">
import type { ThemeMode } from '@/store/modules/theme'

interface Props {
  /** 当前选中的风格 */
  modelValue?: ThemeMode
}

interface Emits {
  (e: 'update:modelValue', value: ThemeMode): void
  (e: 'change', value: ThemeMode): void
}

withDefaults(defineProps<Props>(), {
  modelValue: 'light'
})

const emit = defineEmits<Emits>()

const styles: Array<{ value: ThemeMode; label: string }> = [
  { value: 'light', label: '浅色' },
  { value: 'dark', label: '暗色' }
]

// 处理变化
const handleChange = (e: any) => {
  const value = e.target.value as ThemeMode
  emit('update:modelValue', value)
  emit('change', value)
}
</script>

<style lang="scss" scoped>
.style-selector {
  padding: 8px 0;

  &__item {
    width: 100%;
    height: 100%;
    padding: 0;
    border-radius: 8px;
    transition: all 0.3s ease;

    &:hover {
      background-color: transparent;
    }
  }

  &__preview {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px;
  }

  &__card {
    position: relative;
    width: 100%;
    height: 0;
    padding-bottom: 60%;
    overflow: hidden;
    background-color: #fff;
    border: 1px solid rgb(0 0 0 / 10%);
    border-radius: 4px;
    transition: all 0.3s ease;

    &--light {
      background-color: #fff;
    }

    &--dark {
      background-color: #001529;
    }
  }

  &__preview-svg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  &__check {
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    transform: translate(-50%, -50%);

    svg {
      width: 1em;
      height: 1em;
    }

    &--light {
      color: #2f54eb;
      filter: drop-shadow(0 1px 2px rgb(255 255 255 / 100%));
    }

    &--dark {
      color: #fff;
      filter: drop-shadow(0 1px 2px rgb(0 0 0 / 50%));
    }
  }
}

:deep(.ant-radio-button-wrapper) {
  box-sizing: border-box;
  border: 1px solid #d9d9d9;
  border-radius: 8px;

  &.ant-radio-button-wrapper-checked {
    border: 2px solid #2f54eb;
    box-shadow: 0 0 0 2px rgb(47 84 235 / 20%);
  }
}
</style>
