<!--
 * @Author: liaokt
 * @Description: 
 * @Date: 2025-11-18 09:43:26
 * @LastEditors: liaokt
 * @LastEditTime: 2025-12-12 17:27:49
-->
<template>
  <a-layout class="top-side-layout">
    <Header :show-logo="true" />
    <a-layout
      class="top-side-layout__body"
      :style="{ marginLeft: collapsed ? siderCollapsedWidth : siderWidth, marginTop: headerHeight }"
    >
      <SiderBar :show-logo="false" :collapsed="collapsed" @collapse-change="handleCollapseChange" />
      <a-layout class="top-side-layout__content">
        <a-layout-content class="top-side-layout__main">
          <slot>
            <router-view />
          </slot>
        </a-layout-content>
        <Footer />
      </a-layout>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import Header from '@/layouts/components/components/Header/index.vue'
import SiderBar from '@/layouts/components/components/SiderBar/index.vue'
import Footer from '@/layouts/components/components/Footer/index.vue'
import { HEADER_HEIGHT, SIDER_WIDTH, SIDER_COLLAPSED_WIDTH } from '@/layouts/constants/layout'

interface Props {
  collapsed?: boolean
}

withDefaults(defineProps<Props>(), {
  collapsed: false
})

const emit = defineEmits<{
  collapseChange: [value: boolean]
}>()

const handleCollapseChange = (value: boolean) => {
  emit('collapseChange', value)
}

const headerHeight = HEADER_HEIGHT
const siderWidth = SIDER_WIDTH
const siderCollapsedWidth = SIDER_COLLAPSED_WIDTH
</script>

<style lang="scss" scoped>
@use '../index.module.scss' as layout;
@use '../../constants/styles.scss' as constants;

.top-side-layout {
  @include layout.layout-base;
}

.top-side-layout__body {
  transition:
    margin-left constants.$transition-duration-fast constants.$transition-easing,
    margin-top constants.$transition-duration-fast constants.$transition-easing;
}

.top-side-layout__content {
  @include layout.layout-content;
}

.top-side-layout__main {
  @include layout.layout-main;
}
</style>
