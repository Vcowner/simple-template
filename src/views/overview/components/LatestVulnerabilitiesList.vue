<!--
 * @Author: liaokt
 * @Description: 最新漏洞列表组件
 * @Date: 2025-12-15
-->
<template>
  <a-card class="latest-vulnerabilities-list">
    <template #title>
      <div class="latest-vulnerabilities-list__header">
        <div class="latest-vulnerabilities-list__title">最新漏洞</div>
        <div class="latest-vulnerabilities-list__subtitle">需要优先处理的高危漏洞</div>
      </div>
    </template>
    <a-list :data-source="vulnerabilities" :bordered="false">
      <template #renderItem="{ item }">
        <a-list-item class="latest-vulnerabilities-list__item">
          <a-list-item-meta>
            <template #title>
              <div class="latest-vulnerabilities-list__item-header">
                <span class="latest-vulnerabilities-list__vuln-id">{{ item.id }}</span>
                <a-tag
                  :color="getSeverityColor(item.severity)"
                  class="latest-vulnerabilities-list__severity"
                >
                  {{ item.severity }}
                </a-tag>
              </div>
            </template>
            <template #description>
              <div class="latest-vulnerabilities-list__item-content">
                <span class="latest-vulnerabilities-list__description">{{ item.description }}</span>
                <span class="latest-vulnerabilities-list__assets">
                  影响 {{ item.affectedAssets }} 个资产
                </span>
              </div>
            </template>
          </a-list-item-meta>
          <template #actions>
            <a-tag :color="getStatusColor(item.status)">{{ item.status }}</a-tag>
          </template>
        </a-list-item>
      </template>
    </a-list>
  </a-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface VulnerabilityItem {
  id: string
  severity: '高危' | '严重' | '中危' | '低危'
  description: string
  affectedAssets: number
  status: '待处理' | '修复中' | '待验证' | '已修复'
}

/**
 * 漏洞数据
 */
const vulnerabilities = ref<VulnerabilityItem[]>([
  {
    id: 'CVE-2024-0001',
    severity: '高危',
    description: '麒麟操作系统权限提升漏洞',
    affectedAssets: 45,
    status: '待处理'
  },
  {
    id: 'CNVD-2024-0234',
    severity: '严重',
    description: '达梦数据库SQL注入漏洞',
    affectedAssets: 12,
    status: '修复中'
  },
  {
    id: 'CVE-2024-0123',
    severity: '高危',
    description: '东方通中间件远程代码执行',
    affectedAssets: 28,
    status: '待验证'
  },
  {
    id: 'CNVD-2024-0456',
    severity: '中危',
    description: '统信操作系统内核漏洞',
    affectedAssets: 67,
    status: '待处理'
  }
])

/**
 * 获取严重程度对应的颜色
 */
const getSeverityColor = (severity: string): string => {
  const colorMap: Record<string, string> = {
    严重: 'red',
    高危: 'orange',
    中危: 'gold',
    低危: 'blue'
  }
  return colorMap[severity] || 'default'
}

/**
 * 获取状态对应的颜色
 */
const getStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    待处理: 'orange',
    修复中: 'blue',
    待验证: 'purple',
    已修复: 'green'
  }
  return colorMap[status] || 'default'
}
</script>

<style lang="scss" scoped>
.latest-vulnerabilities-list {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgb(0 0 0 / 4%);

  &__header {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-height: 60px;
    padding: 8px 0;
  }

  &__title {
    font-size: 16px;
    font-weight: 600;
    line-height: 1.5;
    color: rgb(0 0 0 / 85%);
  }

  &__subtitle {
    font-size: 14px;
    font-weight: 400;
    line-height: 1.5;
    color: rgb(0 0 0 / 65%);
  }

  &__item {
    padding: 16px 0;
    border-bottom: 1px solid rgb(0 0 0 / 6%);

    &:last-child {
      border-bottom: none;
    }
  }

  &__item-header {
    display: flex;
    gap: 12px;
    align-items: center;
    margin-bottom: 8px;
  }

  &__vuln-id {
    font-size: 14px;
    font-weight: 500;
    color: rgb(0 0 0 / 85%);
  }

  &__severity {
    margin: 0;
  }

  &__item-content {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &__description {
    font-size: 14px;
    line-height: 1.5;
    color: rgb(0 0 0 / 65%);
  }

  &__assets {
    font-size: 12px;
    color: rgb(0 0 0 / 45%);
  }
}

// 暗色主题适配
[data-theme='dark'] {
  .latest-vulnerabilities-list {
    &__title {
      color: rgb(255 255 255 / 85%);
    }

    &__subtitle {
      color: rgb(255 255 255 / 65%);
    }

    &__item {
      border-bottom-color: rgb(255 255 255 / 12%);
    }

    &__vuln-id {
      color: rgb(255 255 255 / 85%);
    }

    &__description {
      color: rgb(255 255 255 / 65%);
    }

    &__assets {
      color: rgb(255 255 255 / 45%);
    }
  }
}
</style>
