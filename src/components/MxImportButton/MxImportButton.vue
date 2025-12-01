<template>
  <div
    :class="[
      'mx-import-button-wrapper',
      {
        'mx-import-button-wrapper--drag': uploadType === 'drag',
        'mx-import-button-wrapper--modal': uploadType === 'modal'
      }
    ]"
  >
    <!-- 点击上传模式 -->
    <UploadButton
      v-if="uploadType === 'button'"
      :upload-props="uploadComponentProps"
      :type="type"
      :size="size"
      :disabled="disabled"
      :loading="loading"
      :custom-class="customClass"
      :permission="permission"
      :hide-icon="hideIcon"
      :debounce="debounce"
      :list-type="listType"
      @update:file-list="handleFileListUpdate"
      @change="handleChange"
      @remove="handleRemove"
    >
      <template #default>
        <slot>导入</slot>
      </template>
    </UploadButton>

    <!-- 拖拽上传模式 -->
    <UploadDragger
      v-else-if="uploadType === 'drag'"
      :upload-props="uploadComponentProps"
      :disabled="disabled"
      :loading="loading"
      :custom-class="customClass"
      @update:file-list="handleFileListUpdate"
      @change="handleChange"
      @remove="handleRemove"
    >
      <template #default>
        <slot>点击或拖拽文件到此区域上传</slot>
      </template>
      <template #hint>
        <slot name="hint">支持单个或批量上传</slot>
      </template>
    </UploadDragger>

    <!-- 弹窗上传模式 -->
    <UploadModal
      v-else
      :upload-props="uploadComponentProps"
      :type="type"
      :size="size"
      :disabled="disabled"
      :loading="loading"
      :custom-class="customClass"
      :permission="permission"
      :hide-icon="hideIcon"
      :debounce="debounce"
      :download-template="downloadTemplate"
      @update:file-list="handleFileListUpdate"
      @change="handleChange"
      @remove="handleRemove"
      @close-modal="handleModalClose"
    >
      <template #default>
        <slot>导入</slot>
      </template>
      <template #hint>
        <slot name="hint">支持单个或批量上传</slot>
      </template>
    </UploadModal>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { UploadProps, UploadChangeParam, UploadFile } from 'ant-design-vue'
import type { MxImportButtonProps, UploadProgressEvent } from './importButtonTypes'
import { validateFileType, validateFileSize, getFileUrl, ensureFileUrl } from './utils'
import { handleFileTypeError, handleFileSizeError } from './utils/errorHandler'
import UploadButton from './components/UploadButton.vue'
import UploadDragger from './components/UploadDragger.vue'
import UploadModal from './components/UploadModal.vue'

defineOptions({
  name: 'MxImportButton'
})

const emit = defineEmits<{
  'update:fileList': [fileList: UploadProps['fileList']]
  change: [info: UploadChangeParam]
  import: [fileList: UploadProps['fileList']]
  success: [info: UploadChangeParam]
  error: [error: Error, info: UploadChangeParam]
  progress: [info: UploadProgressEvent]
}>()

const props = withDefaults(defineProps<MxImportButtonProps>(), {
  uploadType: 'button',
  type: 'default',
  size: 'middle',
  disabled: false,
  loading: false,
  customClass: '',
  hideIcon: false,
  accept: undefined,
  multiple: false,
  fileList: undefined,
  showUploadList: true,
  listType: undefined,
  maxCount: undefined,
  maxSize: undefined,
  action: undefined,
  customRequest: undefined,
  beforeUpload: undefined,
  remove: undefined,
  preview: undefined,
  download: undefined,
  debounce: 0,
  downloadTemplate: undefined
})

const importEmitLock = ref(false)

/** 处理弹窗关闭 */
const handleModalClose = () => {
  importEmitLock.value = false
}

// 规范化 showUploadList 配置
const normalizedShowUploadList = computed(() => {
  if (props.showUploadList === false) {
    return false
  }
  if (props.showUploadList === true) {
    return {
      showPreviewIcon: true,
      showDownloadIcon: false,
      showRemoveIcon: true
    }
  }
  if (typeof props.showUploadList === 'object') {
    return {
      showPreviewIcon: props.showUploadList.showPreviewIcon !== false,
      showDownloadIcon: props.showUploadList.showDownloadIcon === true,
      showRemoveIcon: props.showUploadList.showRemoveIcon !== false,
      ...props.showUploadList
    }
  }
  return props.showUploadList
})

// 优化：预先定义需要排除的属性键，避免每次计算时 delete
const EXCLUDED_PROPS = new Set([
  'uploadType',
  'type',
  'size',
  'customClass',
  'permission',
  'hideIcon',
  'accept',
  'multiple',
  'fileList',
  'showUploadList',
  'listType',
  'maxCount',
  'maxSize',
  'action',
  'customRequest',
  'beforeUpload',
  'remove',
  'preview',
  'download',
  'debounce',
  'downloadTemplate'
])

// 优化：使用 Object.fromEntries 和 Object.entries 过滤，性能更好
// 获取需要传递给上传组件的额外属性（排除自定义属性）
const extraUploadProps = computed(() => {
  const propsObj = props as Record<string, any>
  return Object.fromEntries(Object.entries(propsObj).filter(([key]) => !EXCLUDED_PROPS.has(key)))
})

// 公共的上传组件属性（需要显式传递的）
const uploadComponentProps = computed(() => ({
  accept: props.accept,
  multiple: props.multiple,
  'file-list': props.fileList,
  'list-type': props.listType,
  'show-upload-list': normalizedShowUploadList.value,
  'max-count': props.maxCount,
  action: props.action,
  'custom-request': props.customRequest,
  'before-upload': handleBeforeUpload,
  'preview-file': handlePreviewFile,
  download: handleDownload,
  ...extraUploadProps.value
}))

/** 处理文件上传前的验证 */
const handleBeforeUpload = (file: any, fileList: any[]) => {
  // 文件类型验证
  if (props.accept && !validateFileType(file, props.accept)) {
    handleFileTypeError(props.accept)
    return false
  }

  // 文件大小验证
  if (props.maxSize && !validateFileSize(file, props.maxSize)) {
    handleFileSizeError(props.maxSize)
    return false
  }

  // 调用用户自定义的 beforeUpload
  if (props.beforeUpload) {
    const result = props.beforeUpload(file, fileList)
    return result instanceof Promise ? result : result
  }

  return true
}

/** 处理删除文件 */
const handleRemove = async (file: UploadFile) => {
  if (props.remove) {
    try {
      const result = await props.remove(file)
      if (result === false) {
        return false
      }
    } catch {
      return false
    }
  }
  importEmitLock.value = false
  return true
}

/** 处理预览文件 */
const handlePreviewFile = async (file: UploadFile | File | Blob): Promise<string> => {
  if (!('uid' in file)) {
    return ''
  }

  const uploadFile = file as UploadFile
  const fileUrl = getFileUrl(uploadFile)
  if (!fileUrl) {
    return ''
  }

  if (props.preview) {
    try {
      const result = await props.preview(uploadFile)
      return result || fileUrl
    } catch {
      return fileUrl
    }
  }

  return fileUrl
}

/** 处理下载文件 */
const handleDownload = (file: UploadFile | File | Blob): Promise<string> => {
  if (props.download && 'uid' in file) {
    props.download(file as UploadFile)
  }
  return Promise.resolve('')
}

/** 处理文件列表更新 */
const handleFileListUpdate = (val: UploadProps['fileList']) => {
  emit('update:fileList', val)
}

/** 处理文件变化 */
const handleChange = (info: UploadChangeParam) => {
  // 如果使用 customRequest，确保上传成功的文件包含 url
  if (props.customRequest && info.file.status === 'done') {
    ensureFileUrl(info.file)
  }

  emit('update:fileList', info.fileList)
  emit('change', info)

  // 触发上传进度事件
  if (info.file.status === 'uploading') {
    const percent = info.file.percent ?? info.event?.percent ?? 0
    if (percent > 0) {
      emit('progress', { percent, file: info.file })
    }
  }

  // 触发成功/失败事件
  if (info.file.status === 'done') {
    emit('success', info)
    const allDone =
      info.fileList?.length && info.fileList.length > 0
        ? info.fileList.every(file => file.status === 'done')
        : true
    if (allDone && !importEmitLock.value) {
      emit('import', info.fileList)
      importEmitLock.value = true
    }
  } else if (info.file.status === 'error') {
    const error = new Error(info.file.error?.message || '上传失败')
    emit('error', error, info)
  }

  // 当文件状态回退或开始新上传时，允许重新触发 import
  if (info.file.status === 'removed' || info.file.status === 'uploading') {
    importEmitLock.value = false
  }
}
</script>

<style scoped lang="scss">
// 修复样式穿透问题
:deep(.template-btn) {
  padding: 0;
}

.mx-import-button-wrapper {
  display: inline-block;

  &--drag {
    display: block;
  }

  &--modal {
    display: inline-block;
  }

  // 文件列表样式
  :deep(.ant-upload-list-item) {
    .ant-upload-list-item-name {
      text-decoration: none !important;
    }

    .ant-upload-list-item-actions {
      .anticon-delete {
        color: #ff4d4f !important;

        &:hover {
          color: #ff7875 !important;
        }
      }

      .anticon-download {
        color: #1890ff !important;

        &:hover {
          color: #40a9ff !important;
        }
      }
    }

    // 上传成功状态 - 绿色
    &.ant-upload-list-item-done {
      .ant-upload-list-item-name,
      .ant-upload-list-item-icon,
      .ant-upload-text-icon {
        color: #52c41a !important;
      }
    }

    // 上传中状态 - 蓝色
    &.ant-upload-list-item-uploading {
      .ant-upload-list-item-name,
      .ant-upload-list-item-icon,
      .ant-upload-text-icon {
        color: #1890ff !important;
      }
    }

    // 上传失败状态 - 红色
    &.ant-upload-list-item-error {
      .ant-upload-list-item-name,
      .ant-upload-list-item-icon,
      .ant-upload-text-icon {
        color: #ff4d4f !important;
      }
    }
  }
}
</style>
