<template>
  <a-dropdown trigger="click">
    <a-button type="text" class="theme-switcher" @click.prevent>
      <BgColorsOutlined />
    </a-button>
    <template #overlay>
      <a-menu class="theme-switcher__menu" :selected-keys="[themeMode]" @click="handleMenuClick">
        <a-menu-item key="light">
          <span>默认主题</span>
        </a-menu-item>
        <a-menu-item key="dark">
          <span>暗色主题</span>
        </a-menu-item>
        <a-menu-item key="compact">
          <span>紧凑主题</span>
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { MenuInfo } from 'ant-design-vue/es/menu/src/interface'
import { BgColorsOutlined } from '@ant-design/icons-vue'
import { useThemeStore } from '@/store/theme'

const themeStore = useThemeStore()
const themeMode = computed(() => themeStore.themeMode)

const handleMenuClick = ({ key }: MenuInfo) => {
  themeStore.setThemeMode(key as typeof themeStore.themeMode)
}
</script>

<style scoped lang="scss">
@use '@/assets/styles/_variables.scss' as vars;

.theme-switcher {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 8px;
  font-size: 18px;
  color: vars.$app-subtext;
}

.theme-switcher__menu {
  min-width: 140px;
}
</style>
