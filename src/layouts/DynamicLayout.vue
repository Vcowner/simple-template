<!--
 * @Author: liaokt
 * @Description: 统一布局组件（类似 ProLayout）
 * 根据 navigationMode 动态渲染不同的布局模式
 * @Date: 2025-12-04
-->
<template>
  <!-- 根据导航模式动态渲染对应的布局组件 -->
  <SideLayout
    v-if="navigationMode === 'side'"
    :collapsed="collapsed"
    @collapse-change="handleCollapseChange"
  >
    <slot>
      <router-view />
    </slot>
  </SideLayout>

  <TopSideLayout
    v-else-if="navigationMode === 'top-side'"
    :collapsed="collapsed"
    @collapse-change="handleCollapseChange"
  >
    <slot>
      <router-view />
    </slot>
  </TopSideLayout>

  <BasicLayout v-else>
    <slot>
      <router-view />
    </slot>
  </BasicLayout>

  <!-- 主题编辑器（包含抽屉和手柄）- 只在登录后的页面显示 -->
  <ThemeEditor v-if="shouldShowThemeEditor" v-model:open="showThemeEditor" />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { useUserStore } from '@/store/modules/user'
import { ThemeEditor } from '@/components/ThemeEditor'
import { SideLayout, TopSideLayout, BasicLayout } from './components/index'

const appStore = useAppStore()
const userStore = useUserStore()

// 主题编辑器显示状态
const showThemeEditor = ref(false)

// 是否显示主题编辑器（只在登录后显示）
const shouldShowThemeEditor = computed(() => userStore.isLoggedIn)

// 获取当前导航模式
const navigationMode = computed(() => appStore.navigationMode)

// 每个布局模式的折叠状态（独立管理）
const collapsedStates = ref<Record<string, boolean>>({
  side: false,
  'top-side': false,
  basic: false
})

// 当前布局的折叠状态
const collapsed = computed({
  get: () => collapsedStates.value[navigationMode.value] ?? false,
  set: val => {
    collapsedStates.value[navigationMode.value] = val
  }
})

// 处理折叠状态变化
const handleCollapseChange = (value: boolean) => {
  collapsed.value = value
}
</script>
