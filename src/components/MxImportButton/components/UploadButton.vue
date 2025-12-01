<!--
 * @Author: liaokt
 * @Description: 
 * @Date: 2025-12-01 16:46:07
 * @LastEditors: liaokt
 * @LastEditTime: 2025-12-01 16:53:13
-->
<template>
  <a-upload
    v-bind="uploadProps"
    @update:file-list="$emit('update:fileList', $event)"
    @change="$emit('change', $event)"
    @remove="$emit('remove', $event)"
  >
    <!-- picture-card 模式使用默认插槽 -->
    <template v-if="listType === 'picture-card'">
      <slot>
        <div>
          <UploadOutlined />
          <div style="margin-top: 8px">上传</div>
        </div>
      </slot>
    </template>
    <!-- picture 或 text 模式使用按钮 -->
    <mx-button
      v-else
      :type="type"
      :size="size"
      :disabled="disabled || loading"
      :loading="loading"
      :custom-class="customClass"
      :permission="permission"
      :debounce="debounce"
    >
      <template v-if="!hideIcon && !loading" #icon>
        <UploadOutlined />
      </template>
      <slot>导入</slot>
    </mx-button>
  </a-upload>
</template>

<script setup lang="ts">
import { UploadOutlined } from '@ant-design/icons-vue'
import MxButton from '../../MxButton/MxButton.vue'
import type { UploadProps } from 'ant-design-vue'
import type { MxImportButtonProps } from '../importButtonTypes'

defineOptions({
  name: 'UploadButton'
})

defineProps<{
  uploadProps: Record<string, any>
  type?: MxImportButtonProps['type']
  size?: MxImportButtonProps['size']
  disabled?: boolean
  loading?: boolean
  customClass?: string
  permission?: string | string[]
  hideIcon?: boolean
  debounce?: number
  listType?: MxImportButtonProps['listType']
}>()

defineEmits<{
  'update:fileList': [fileList: UploadProps['fileList']]
  change: [info: any]
  remove: [file: any]
}>()
</script>
