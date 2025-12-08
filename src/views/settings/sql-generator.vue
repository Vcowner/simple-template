<!--
 * @Author: liaokt
 * @Description: SQL 生成工具页面
 * @Date: 2025-12-08
-->
<template>
  <MxResponsiveContainer class="sql-generator">
    <a-card class="sql-generator__card" title="权限 SQL 生成工具">
      <template #extra>
        <a-space>
          <a-button type="primary" @click="handleGenerateSql">
            <template #icon>
              <FileTextOutlined />
            </template>
            生成 SQL
          </a-button>
          <a-button @click="handleDownloadSql">
            <template #icon>
              <DownloadOutlined />
            </template>
            下载 SQL 文件
          </a-button>
          <a-button @click="handleCopySql">
            <template #icon>
              <CopyOutlined />
            </template>
            复制 SQL
          </a-button>
        </a-space>
      </template>

      <a-form layout="vertical" :model="formState">
        <a-row :gutter="24">
          <a-col :xs="24" :md="12">
            <a-form-item label="表名">
              <a-input
                v-model:value="formState.tableName"
                placeholder="请输入表名，默认为 permissions"
              />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="12">
            <a-form-item label="SQL 类型">
              <a-radio-group v-model:value="formState.sqlType">
                <a-radio value="insert">仅 INSERT 语句</a-radio>
                <a-radio value="full">包含建表语句</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>

      <a-divider>SQL 预览</a-divider>

      <div class="sql-generator__preview">
        <a-textarea
          v-model:value="sqlContent"
          :rows="20"
          readonly
          placeholder="点击「生成 SQL」按钮生成 SQL 语句"
          class="sql-generator__textarea"
        />
      </div>

      <div class="sql-generator__info">
        <a-alert message="使用说明" type="info" show-icon :closable="false">
          <template #description>
            <ul class="sql-generator__tips">
              <li>生成 SQL 语句用于将权限配置数据插入到数据库</li>
              <li>如果选择"仅 INSERT 语句"，将生成 INSERT 语句，适用于表已存在的情况</li>
              <li>如果选择"包含建表语句"，将生成完整的 SQL 脚本，包括建表语句和 INSERT 语句</li>
              <li>INSERT 语句使用 ON DUPLICATE KEY UPDATE，避免重复插入</li>
            </ul>
          </template>
        </a-alert>
      </div>
    </a-card>
  </MxResponsiveContainer>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { message } from 'ant-design-vue'
import { FileTextOutlined, DownloadOutlined, CopyOutlined } from '@ant-design/icons-vue'
import { generateInsertSqlScript, generateFullSqlScript } from '@/config/permissions/generateSql'
import { MxResponsiveContainer } from '@/components/MxResponsiveContainer'

// 表单状态
const formState = reactive({
  tableName: 'permissions',
  sqlType: 'insert' as 'insert' | 'full'
})

// SQL 内容
const sqlContent = ref('')

// 生成 SQL
const handleGenerateSql = () => {
  try {
    if (formState.sqlType === 'insert') {
      sqlContent.value = generateInsertSqlScript(formState.tableName)
    } else {
      sqlContent.value = generateFullSqlScript(formState.tableName)
    }
    message.success('SQL 生成成功')
  } catch (error: any) {
    console.error('生成 SQL 失败:', error)
    message.error(error.message || '生成 SQL 失败')
  }
}

// 下载 SQL 文件
const handleDownloadSql = () => {
  if (!sqlContent.value) {
    message.warning('请先生成 SQL')
    return
  }

  try {
    const filename = `permissions-${formState.tableName}-${Date.now()}.sql`
    const blob = new Blob([sqlContent.value], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    message.success('SQL 文件下载成功')
  } catch (error: any) {
    console.error('下载 SQL 失败:', error)
    message.error(error.message || '下载 SQL 失败')
  }
}

// 复制 SQL
const handleCopySql = async () => {
  if (!sqlContent.value) {
    message.warning('请先生成 SQL')
    return
  }

  try {
    await navigator.clipboard.writeText(sqlContent.value)
    message.success('SQL 已复制到剪贴板')
  } catch (error: any) {
    console.error('复制 SQL 失败:', error)
    // 降级方案：使用传统方法
    const textarea = document.createElement('textarea')
    textarea.value = sqlContent.value
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    try {
      document.execCommand('copy')
      message.success('SQL 已复制到剪贴板')
    } catch (err) {
      message.error('复制失败，请手动复制')
    }
    document.body.removeChild(textarea)
  }
}
</script>

<style lang="scss" scoped>
@use '@/assets/styles/_variables' as vars;

.sql-generator {
  &__card {
    border-radius: vars.$app-card-radius;
  }

  &__preview {
    margin-bottom: 24px;
  }

  &__textarea {
    font-family: Monaco, Menlo, 'Ubuntu Mono', Consolas, source-code-pro, monospace;
    font-size: 13px;
    line-height: 1.6;
  }

  &__info {
    margin-top: 24px;
  }

  &__tips {
    padding-left: 20px;
    margin: 8px 0 0;

    li {
      margin-bottom: 8px;
      line-height: 1.6;
    }
  }
}

:deep(.ant-card-head-title) {
  font-size: 18px;
  font-weight: 600;
}

:deep(.ant-alert-description) {
  ul {
    margin: 0;
  }
}
</style>
