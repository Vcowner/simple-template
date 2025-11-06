<template>
  <div class="antd-example">
    <a-button type="primary" @click="handleClick">
      <template #icon>
        <SmileOutlined />
      </template>
      点击我
    </a-button>
    <a-space>
      <UserOutlined />
      <HomeOutlined />
      <SettingOutlined />
    </a-space>
    <a-alert message="Ant Design Vue 已集成" type="success" show-icon style="margin-top: 16px" />
  </div>
</template>

<script setup lang="ts">
import { message } from 'ant-design-vue'
import { SmileOutlined, UserOutlined, HomeOutlined, SettingOutlined } from '@ant-design/icons-vue'

const handleClick = () => {
  message.success('按钮点击成功！')
}
</script>

<style scoped>
.antd-example {
  padding: 20px;
}
</style>

