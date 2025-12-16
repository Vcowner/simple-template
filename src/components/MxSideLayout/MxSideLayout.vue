<!--
 * @Author: liaokt
 * @Description: 侧边布局组件 - 左侧树形结构，右侧内容区域
 * @Date: 2025-12-15
-->
<template>
  <a-layout :class="['mx-side-layout', customClass]">
    <!-- 左侧面板 -->
    <a-layout-sider
      :width="siderWidth"
      :collapsed-width="0"
      :collapsed="localCollapsed"
      :collapsible="collapsible"
      :resizable="resizable"
      :theme="theme"
      :trigger="null"
      class="mx-side-layout__sider"
      @collapse="handleCollapse"
    >
      <!-- 标题栏 -->
      <div v-if="leftTitle" class="mx-side-layout__header">
        <span v-if="!localCollapsed" class="mx-side-layout__title">{{ leftTitle }}</span>
        <div v-if="!localCollapsed" class="mx-side-layout__header-extra">
          <slot name="headerExtra" />
        </div>
      </div>

      <!-- 左侧内容区域（树形结构等） -->
      <div class="mx-side-layout__content">
        <slot name="left">
          <!-- 默认内容：提示用户使用 left slot -->
          <a-empty description="请使用 #left slot 添加左侧内容" />
        </slot>
      </div>

      <!-- 折叠按钮 - 放在 sider 右侧边缘 -->
      <div v-if="collapsible" class="mx-side-layout__trigger" @click="handleToggleCollapse">
        <component :is="localCollapsed ? MenuUnfoldOutlined : MenuFoldOutlined" />
      </div>
    </a-layout-sider>

    <!-- 右侧内容区域 -->
    <a-layout-content class="mx-side-layout__main">
      <slot>
        <!-- 默认内容：提示用户添加右侧内容 -->
        <a-empty description="请添加右侧内容" />
      </slot>
    </a-layout-content>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons-vue'
import type { MxSideLayoutProps, MxSideLayoutEmits } from './sideLayoutTypes'

/**
 * MxSideLayout 侧边布局组件
 * 用于左侧显示树形结构（如部门树、角色列表），右侧显示表格或详情
 *
 * @example
 * ```vue
 * <!-- 基础用法 -->
 * <mx-side-layout left-title="部门树">
 *   <template #left>
 *     <a-tree :tree-data="treeData" />
 *   </template>
 *   <template #default>
 *     <a-table :columns="columns" :data-source="data" />
 *   </template>
 * </mx-side-layout>
 *
 * <!-- 可折叠 -->
 * <mx-side-layout left-title="角色列表" :collapsible="true" v-model:collapsed="collapsed">
 *   <template #left>
 *     <a-list :data-source="roles" />
 *   </template>
 *   <template #default>
 *     <a-table :columns="columns" :data-source="data" />
 *   </template>
 * </mx-side-layout>
 *
 * <!-- 可调整宽度 -->
 * <mx-side-layout :resizable="true" :left-width="300">
 *   <template #left>
 *     <a-tree :tree-data="treeData" />
 *   </template>
 *   <template #default>
 *     <a-table :columns="columns" :data-source="data" />
 *   </template>
 * </mx-side-layout>
 * ```
 */
defineOptions({
  name: 'MxSideLayout'
})

const props = withDefaults(defineProps<MxSideLayoutProps>(), {
  leftWidth: 280,
  rightWidth: 'auto',
  resizable: false,
  collapsible: false,
  collapsed: false,
  leftTitle: '',
  leftMinWidth: 200,
  leftMaxWidth: 400,
  customClass: ''
})

const emit = defineEmits<MxSideLayoutEmits>()

// 折叠状态 - 使用本地状态
const localCollapsed = ref(false)

// 侧边栏宽度
const siderWidth = computed(() => {
  return typeof props.leftWidth === 'number' ? props.leftWidth : props.leftWidth
})

// 主题（根据全局主题自动适配）
const theme = computed(() => {
  const html = document.documentElement
  return html.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'
})

// 处理折叠状态变化
const handleCollapse = (collapsed: boolean) => {
  localCollapsed.value = collapsed
  emit('collapseChange', collapsed)
  emit('update:collapsed', collapsed)
}

// 切换折叠状态
const handleToggleCollapse = () => {
  localCollapsed.value = !localCollapsed.value
}
</script>

<style lang="scss" scoped>
.mx-side-layout {
  width: 100%;
  height: 100%;
  min-height: calc(100vh - 300px);

  &__sider {
    position: relative;
    height: 100%;
    border-right: 1px solid rgb(0 0 0 / 6%);

    :deep(.ant-layout-sider-children) {
      display: flex;
      flex-direction: column;
      height: 100%;
    }
  }

  &__header {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    background: rgb(250 250 250);
    border-bottom: 1px solid rgb(0 0 0 / 6%);
  }

  &__title {
    font-size: 14px;
    font-weight: 500;
    color: rgb(0 0 0 / 85%);
  }

  &__header-extra {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  &__trigger {
    position: absolute;
    top: 50%;
    right: -16px;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    font-size: 14px;
    color: rgb(0 0 0 / 45%);
    cursor: pointer;
    background: #fff;
    border: 1px solid rgb(0 0 0 / 6%);
    border-radius: 4px 0 0 4px;
    transform: translateY(-50%);
    transition:
      right 0.3s ease,
      color 0.3s ease,
      background-color 0.3s ease,
      border-color 0.3s ease;
  }

  &__sider.ant-layout-sider-collapsed {
    .mx-side-layout__trigger {
      right: -16px;
      border-radius: 0 4px 4px 0;
    }
  }

  &__trigger:hover {
    color: rgb(0 0 0 / 85%);
    background: rgb(250 250 250);
    border-color: rgb(0 0 0 / 12%);
  }

  &__content {
    flex: 1;
    min-height: 0;
    padding: 8px;
    overflow-y: auto;
  }

  &__main {
    height: 100%;
    padding: 24px;
    overflow: auto;
    background: #fff;
  }
}

// 暗色主题适配
[data-theme='dark'] {
  .mx-side-layout {
    &__sider {
      border-right-color: rgb(255 255 255 / 12%);
    }

    &__header {
      background: rgb(255 255 255 / 2%);
      border-bottom-color: rgb(255 255 255 / 12%);
    }

    &__title {
      color: rgb(255 255 255 / 85%);
    }

    &__trigger {
      color: rgb(255 255 255 / 45%);
      background: rgb(255 255 255 / 4%);
      border-color: rgb(255 255 255 / 12%);

      &:hover {
        color: rgb(255 255 255 / 85%);
        background: rgb(255 255 255 / 8%);
        border-color: rgb(255 255 255 / 20%);
      }
    }

    &__main {
      background: rgb(255 255 255 / 4%);
    }
  }
}
</style>
