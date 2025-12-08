<!--
 * @Author: liaokt
 * @Description: 首页
 * @Date: 2025-12-03
-->
<template>
  <MxResponsiveContainer class="home">
    <!-- 欢迎区域 -->
    <div class="home__welcome">
      <div class="home__welcome-content">
        <h1 class="home__title">
          欢迎回来，<span class="home__username">{{ userInfo?.name || '用户' }}</span>
        </h1>
        <p class="home__subtitle">今天是 {{ currentDate }}，祝您工作愉快！</p>
      </div>
    </div>

    <!-- 数据统计卡片 -->
    <a-row :gutter="[24, 24]" class="home__stats">
      <a-col v-for="stat in stats" :key="stat.key" :xs="24" :sm="12" :md="8" :lg="6">
        <a-card class="home__stat-card" :class="`home__stat-card--${stat.key}`">
          <div class="home__stat-content">
            <div class="home__stat-icon" :style="{ backgroundColor: stat.color }">
              <component :is="stat.icon" />
            </div>
            <div class="home__stat-info">
              <div class="home__stat-label">{{ stat.label }}</div>
              <div class="home__stat-value">{{ stat.value }}</div>
            </div>
          </div>
        </a-card>
      </a-col>
    </a-row>

    <!-- 快捷操作 -->
    <a-card class="home__quick-actions" title="快捷操作">
      <a-row :gutter="[16, 16]">
        <a-col v-for="action in quickActions" :key="action.key" :xs="12" :sm="8" :md="6" :lg="4">
          <div class="home__action-item" @click="handleAction(action)">
            <div class="home__action-icon" :style="{ backgroundColor: action.color }">
              <component :is="action.icon" />
            </div>
            <div class="home__action-label">{{ action.label }}</div>
          </div>
        </a-col>
      </a-row>
    </a-card>

    <!-- 最近活动或通知 -->
    <a-row :gutter="[24, 24]">
      <a-col :xs="24" :lg="12">
        <a-card class="home__card" title="最近活动">
          <a-empty v-if="recentActivities.length === 0" description="暂无最近活动" />
          <a-timeline v-else>
            <a-timeline-item v-for="activity in recentActivities" :key="activity.id">
              <div class="home__activity">
                <div class="home__activity-title">{{ activity.title }}</div>
                <div class="home__activity-time">{{ activity.time }}</div>
              </div>
            </a-timeline-item>
          </a-timeline>
        </a-card>
      </a-col>
      <a-col :xs="24" :lg="12">
        <a-card class="home__card" title="系统通知">
          <a-empty v-if="notifications.length === 0" description="暂无通知" />
          <a-list v-else :data-source="notifications" :bordered="false">
            <template #renderItem="{ item }">
              <a-list-item>
                <a-list-item-meta>
                  <template #title>
                    <span :class="{ 'home__notification--unread': !item.read }">
                      {{ item.title }}
                    </span>
                  </template>
                  <template #description>
                    <div class="home__notification-content">{{ item.content }}</div>
                    <div class="home__notification-time">{{ item.time }}</div>
                  </template>
                </a-list-item-meta>
              </a-list-item>
            </template>
          </a-list>
        </a-card>
      </a-col>
    </a-row>
  </MxResponsiveContainer>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  DatabaseOutlined,
  FileTextOutlined,
  SettingOutlined,
  BarChartOutlined,
  SafetyOutlined,
  AppstoreOutlined,
  TeamOutlined
} from '@ant-design/icons-vue'
import { useUserStore } from '@/store/user'
import { message } from 'ant-design-vue'
import { MxResponsiveContainer } from '@/components/MxResponsiveContainer'

const userStore = useUserStore()
const userInfo = computed(() => userStore.userInfo)

// 当前日期
const currentDate = computed(() => {
  const now = new Date()
  const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const weekday = weekdays[now.getDay()]
  return `${year}年${month}月${day}日 ${weekday}`
})

// 统计数据
const stats = ref([
  {
    key: 'devices',
    label: '设备总数',
    value: '1,234',
    icon: DatabaseOutlined,
    color: '#2f54eb'
  },
  {
    key: 'flows',
    label: '流量记录',
    value: '56,789',
    icon: BarChartOutlined,
    color: '#52c41a'
  },
  {
    key: 'features',
    label: '特征数量',
    value: '890',
    icon: FileTextOutlined,
    color: '#faad14'
  },
  {
    key: 'users',
    label: '用户数量',
    value: '128',
    icon: TeamOutlined,
    color: '#eb2f96'
  }
])

// 快捷操作
const quickActions = ref([
  {
    key: 'device',
    label: '设备管理',
    icon: DatabaseOutlined,
    color: '#2f54eb'
  },
  {
    key: 'flow',
    label: '流量分析',
    icon: BarChartOutlined,
    color: '#52c41a'
  },
  {
    key: 'feature',
    label: '特征管理',
    icon: FileTextOutlined,
    color: '#faad14'
  },
  {
    key: 'model',
    label: '模型训练',
    icon: AppstoreOutlined,
    color: '#722ed1'
  },
  {
    key: 'security',
    label: '安全设置',
    icon: SafetyOutlined,
    color: '#eb2f96'
  },
  {
    key: 'settings',
    label: '系统设置',
    icon: SettingOutlined,
    color: '#13c2c2'
  }
])

// 最近活动
const recentActivities = ref([
  {
    id: 1,
    title: '新增设备特征识别规则',
    time: '2小时前'
  },
  {
    id: 2,
    title: '完成流量数据分析任务',
    time: '5小时前'
  },
  {
    id: 3,
    title: '更新设备模型配置',
    time: '1天前'
  }
])

// 系统通知
const notifications = ref([
  {
    id: 1,
    title: '系统更新通知',
    content: '系统将在今晚22:00进行维护更新，预计持续30分钟',
    time: '3小时前',
    read: false
  },
  {
    id: 2,
    title: '新功能上线',
    content: '流量特征分析功能已上线，欢迎使用',
    time: '1天前',
    read: true
  }
])

// 处理快捷操作点击
const handleAction = (action: any) => {
  message.info(`跳转到${action.label}功能`)
  // TODO: 实现路由跳转
  // router.push(`/${action.key}`)
}
</script>

<style lang="scss" scoped>
@use '@/assets/styles/_variables' as vars;

.home {
  &__welcome {
    margin-bottom: 24px;
  }

  &__welcome-content {
    padding: 32px;
    color: #fff;
    background: linear-gradient(135deg, vars.$app-primary 0%, #667eea 100%);
    border-radius: vars.$app-card-radius;
  }

  &__title {
    margin: 0 0 8px;
    font-size: 28px;
    font-weight: 700;
    line-height: 1.4;
    color: #fff;
  }

  &__username {
    color: #ffd700;
  }

  &__subtitle {
    margin: 0;
    font-size: 16px;
    opacity: 0.9;
  }

  &__stats {
    margin-bottom: 24px;
  }

  &__stat-card {
    border-radius: vars.$app-card-radius;
    box-shadow: vars.$app-card-shadow;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-4px);
    }
  }

  &__stat-content {
    display: flex;
    gap: 16px;
    align-items: center;
  }

  &__stat-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    font-size: 24px;
    color: #fff;
    border-radius: 12px;
  }

  &__stat-info {
    flex: 1;
  }

  &__stat-label {
    margin-bottom: 4px;
    font-size: 14px;
    color: vars.$app-subtext;
  }

  &__stat-value {
    font-size: 24px;
    font-weight: 700;
    color: vars.$app-text;
  }

  &__quick-actions {
    margin-bottom: 24px;
    border-radius: vars.$app-card-radius;
  }

  &__action-item {
    display: flex;
    flex-direction: column;
    gap: 12px;
    align-items: center;
    padding: 20px;
    cursor: pointer;
    border-radius: 12px;
    transition: all 0.3s ease;

    &:hover {
      background-color: vars.$app-background;
      transform: translateY(-2px);
    }
  }

  &__action-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    font-size: 20px;
    color: #fff;
    border-radius: 12px;
  }

  &__action-label {
    font-size: 14px;
    font-weight: 500;
    color: vars.$app-text;
    text-align: center;
  }

  &__card {
    border-radius: vars.$app-card-radius;
  }

  &__activity {
    &-title {
      margin-bottom: 4px;
      font-size: 14px;
      font-weight: 500;
      color: vars.$app-text;
    }

    &-time {
      font-size: 12px;
      color: vars.$app-subtext;
    }
  }

  &__notification {
    &--unread {
      font-weight: 600;
      color: vars.$app-primary;
    }

    &-content {
      margin-bottom: 4px;
      font-size: 13px;
      color: vars.$app-text;
    }

    &-time {
      font-size: 12px;
      color: vars.$app-subtext;
    }
  }
}

:deep(.ant-card-head-title) {
  font-size: 18px;
  font-weight: 600;
  color: vars.$app-text;
}

:deep(.ant-timeline-item-content) {
  top: -4px;
}

// 暗色主题样式覆盖
[data-theme='dark'] {
  .home {
    &__stat-label {
      color: rgb(255 255 255 / 65%) !important;
    }

    &__stat-value {
      color: rgb(255 255 255 / 85%) !important;
    }

    &__action-label {
      color: rgb(255 255 255 / 85%) !important;
    }

    &__activity-title {
      color: rgb(255 255 255 / 85%) !important;
    }

    &__activity-time {
      color: rgb(255 255 255 / 65%) !important;
    }

    &__notification-content {
      color: rgb(255 255 255 / 85%) !important;
    }

    &__notification-time {
      color: rgb(255 255 255 / 65%) !important;
    }
  }

  :deep(.ant-card-head-title) {
    color: rgb(255 255 255 / 85%) !important;
  }

  :deep(.ant-card-body) {
    color: rgb(255 255 255 / 85%);
  }

  :deep(.ant-list-item) {
    color: rgb(255 255 255 / 85%);
  }

  :deep(.ant-timeline-item-content) {
    color: rgb(255 255 255 / 85%);
  }
}

@media (width <= 768px) {
  .home {
    &__welcome-content {
      padding: 24px;
    }

    &__title {
      font-size: 22px;
    }

    &__subtitle {
      font-size: 14px;
    }

    &__stat-value {
      font-size: 20px;
    }
  }
}
</style>
