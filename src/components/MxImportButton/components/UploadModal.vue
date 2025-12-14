<template>
  <div class="mx-import-button-modal">
    <mx-button
      :type="type"
      :size="size"
      :disabled="disabled || loading"
      :loading="loading"
      :custom-class="customClass"
      :permission="permission"
      :debounce="debounce"
      @click="openModal"
    >
      <template v-if="!hideIcon && !loading" #icon>
        <UploadOutlined />
      </template>
      <slot>导入</slot>
    </mx-button>

    <a-modal
      :open="modalVisible"
      :confirm-loading="loading"
      :destroy-on-close="true"
      title="批量导入"
      :footer="null"
      width="520px"
      @cancel="closeModal"
    >
      <a-upload-dragger
        v-bind="uploadProps"
        :disabled="disabled || loading"
        class="mx-import-button-modal__dragger"
        @update:file-list="$emit('update:fileList', $event)"
        @change="handleChange"
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

      <div v-if="downloadTemplate" class="mx-import-button-modal__template">
        <mx-button
          type="link"
          :disabled="disabled"
          custom-class="template-btn"
          @click="handleDownloadTemplate"
        >
          <template #icon>
            <DownloadOutlined />
          </template>
          {{ downloadTemplate.text || '下载模板' }}
        </mx-button>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { UploadOutlined, LoadingOutlined, DownloadOutlined } from '@ant-design/icons-vue'
import MxButton from '../../MxButton/MxButton.vue'
import type { UploadProps, UploadChangeParam } from 'ant-design-vue'
import type { MxImportButtonProps, DownloadTemplateConfig } from '../importButtonTypes'
import { downloadTemplate as downloadTemplateFile } from '../utils'

defineOptions({
  name: 'UploadModal'
})

const props = defineProps<{
  uploadProps: Record<string, any>
  type?: MxImportButtonProps['type']
  size?: MxImportButtonProps['size']
  disabled?: boolean
  loading?: boolean
  customClass?: string
  permission?: string | string[]
  hideIcon?: boolean
  debounce?: number
  downloadTemplate?: DownloadTemplateConfig
}>()

const emit = defineEmits<{
  'update:fileList': [fileList: UploadProps['fileList']]
  change: [info: UploadChangeParam]
  remove: [file: any]
  closeModal: []
}>()

const modalVisible = ref(false)

const openModal = () => {
  modalVisible.value = true
}

const closeModal = () => {
  modalVisible.value = false
  emit('closeModal')
}

const handleChange = (info: UploadChangeParam) => {
  emit('change', info)
}

const handleDownloadTemplate = () => {
  if (!props.downloadTemplate?.url) {
    return
  }
  downloadTemplateFile(props.downloadTemplate.url, props.downloadTemplate.filename)
}
</script>

<style scoped lang="scss">
.mx-import-button-modal {
  display: inline-block;
  width: 100%;

  &__dragger {
    margin-bottom: 16px;
  }

  &__template {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid #f0f0f0;

    .template-btn {
      padding: 0;
    }

    &-text {
      font-size: 13px;
      color: #8c8c8c;
    }
  }
}
</style>
