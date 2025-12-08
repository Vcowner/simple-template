<!--
 * @Author: liaokt
 * @Description: 导航模式设置组件
 * @Date: 2025-12-04
-->
<template>
  <div class="navigation-mode-selector">
    <a-radio-group :value="modelValue" style="width: 100%" @change="handleChange">
      <a-row :gutter="[12, 16]">
        <a-col v-for="mode in navigationModes" :key="mode.value" :span="8">
          <a-radio-button :value="mode.value" class="navigation-mode-selector__item">
            <div class="navigation-mode-selector__preview">
              <div
                class="navigation-mode-selector__card"
                :class="[
                  `navigation-mode-selector__card--${mode.value}`,
                  { 'navigation-mode-selector__card--checked': modelValue === mode.value }
                ]"
              >
                <!-- 顶部+侧边栏模式预览 -->
                <svg
                  v-if="mode.value === 'top-side'"
                  class="navigation-mode-selector__preview-svg"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  <!-- 顶部 Header -->
                  <rect x="0" y="0" width="100" height="20" fill="#2f54eb" />
                  <!-- 侧边栏 -->
                  <rect x="0" y="20" width="25" height="80" fill="#f5f5f5" />
                  <line
                    x1="25"
                    y1="20"
                    x2="25"
                    y2="100"
                    stroke="rgb(0 0 0 / 8%)"
                    stroke-width="0.5"
                  />
                  <!-- 主内容区 -->
                  <rect x="25" y="20" width="75" height="80" fill="#fff" />
                </svg>

                <!-- 侧边栏模式预览 -->
                <svg
                  v-else-if="mode.value === 'side'"
                  class="navigation-mode-selector__preview-svg"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  <!-- 侧边栏 -->
                  <rect x="0" y="0" width="25" height="100" fill="#f5f5f5" />
                  <line
                    x1="25"
                    y1="0"
                    x2="25"
                    y2="100"
                    stroke="rgb(0 0 0 / 8%)"
                    stroke-width="0.5"
                  />
                  <!-- 顶部 Header -->
                  <rect x="25" y="0" width="75" height="20" fill="#2f54eb" />
                  <!-- 主内容区 -->
                  <rect x="25" y="20" width="75" height="80" fill="#fff" />
                </svg>

                <!-- 基础模式预览 -->
                <svg
                  v-else-if="mode.value === 'basic'"
                  class="navigation-mode-selector__preview-svg"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  <!-- 顶部 Header -->
                  <rect x="0" y="0" width="100" height="20" fill="#2f54eb" />
                  <!-- 主内容区 -->
                  <rect x="0" y="20" width="100" height="80" fill="#fff" />
                </svg>

                <!-- 选中状态图标 -->
                <div v-if="modelValue === mode.value" class="navigation-mode-selector__check">
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
export type NavigationMode = 'top-side' | 'side' | 'basic'

interface Props {
  /** 当前选中的模式 */
  modelValue?: NavigationMode
}

interface Emits {
  (e: 'update:modelValue', value: NavigationMode): void
  (e: 'change', value: NavigationMode): void
}

withDefaults(defineProps<Props>(), {
  modelValue: 'top-side'
})

const emit = defineEmits<Emits>()

const navigationModes: Array<{ value: NavigationMode; label: string }> = [
  { value: 'top-side', label: '顶部+侧边栏' },
  { value: 'side', label: '侧边栏' },
  { value: 'basic', label: '基础' }
]

// 处理变化
const handleChange = (e: any) => {
  const value = e.target.value as NavigationMode
  emit('update:modelValue', value)
  emit('change', value)
}
</script>

<style lang="scss" scoped>
.navigation-mode-selector {
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

    &--top-side {
      background-color: #fff;
    }

    &--side {
      background-color: #fff;
    }

    &--basic {
      background-color: #fff;
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
    color: #2f54eb;
    filter: drop-shadow(0 1px 2px rgb(255 255 255 / 100%));
    transform: translate(-50%, -50%);

    svg {
      width: 1em;
      height: 1em;
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
