<!--
 * @Author: liaokt
 * @Description: 
 * @Date: 2025-12-01 16:46:12
 * @LastEditors: liaokt
 * @LastEditTime: 2025-12-01 16:53:32
-->
<template>
  <a-upload-dragger
    v-bind="uploadProps"
    :disabled="disabled || loading"
    :class="customClass"
    @update:file-list="$emit('update:fileList', $event)"
    @change="$emit('change', $event)"
    @remove="$emit('remove', $event)"
  >
    <p class="ant-upload-drag-icon">
      <UploadOutlined v-if="!loading" />
      <LoadingOutlined v-else />
    </p>
    <p class="ant-upload-text">
      <slot>点击或拖拽文件到此区域上传</slot>
    </p>
    <p class="ant-upload-hint">
      <slot name="hint">支持单个或批量上传</slot>
    </p>
  </a-upload-dragger>
</template>

<script setup lang="ts">
import { UploadOutlined, LoadingOutlined } from '@ant-design/icons-vue'
import type { UploadProps } from 'ant-design-vue'

defineOptions({
  name: 'UploadDragger'
})

defineProps<{
  uploadProps: Record<string, any>
  disabled?: boolean
  loading?: boolean
  customClass?: string
}>()

defineEmits<{
  'update:fileList': [fileList: UploadProps['fileList']]
  change: [info: any]
  remove: [file: any]
}>()
</script>
