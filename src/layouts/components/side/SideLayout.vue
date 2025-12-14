<!--
 * @Author: liaokt
 * @Description: 
 * @Date: 2025-11-18 09:43:26
 * @LastEditors: liaokt
 * @LastEditTime: 2025-12-12 17:28:54
-->
<template>
  <a-layout class="side-layout">
    <SiderBar
      :show-logo="true"
      :side-layout="true"
      :collapsed="collapsed"
      @collapse-change="handleCollapseChange"
    />
    <a-layout
      class="side-layout__content"
      :style="{
        marginLeft: collapsed ? siderCollapsedWidth : siderWidth,
        paddingTop: headerHeight
      }"
    >
      <Header :show-logo="false" :side-layout="true" :menu-collapsed="collapsed" />
      <a-layout-content class="side-layout__main">
        <slot>
          <router-view />
        </slot>
      </a-layout-content>
      <Footer />
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import SiderBar from '@/layouts/components/components/SiderBar/index.vue'
import Header from '@/layouts/components/components/Header/index.vue'
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

.side-layout {
  @include layout.layout-base;
}

.side-layout__content {
  @include layout.layout-content;
  transition:
    margin-left constants.$transition-duration-fast constants.$transition-easing,
    padding-top constants.$transition-duration-fast constants.$transition-easing,
    background-color constants.$transition-duration-normal ease;
}

.side-layout__main {
  @include layout.layout-main;
}
</style>
