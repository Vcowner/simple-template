<template>
  <LoginSplit
    v-if="loginType === 'split'"
    :form-state="formState"
    :loading="loading"
    :rules="rules"
    :app-title="appTitle"
    :logo-url="logoUrl"
    :background-url="backgroundUrl"
    @submit="handleSubmit"
  />
  <LoginCenter
    v-else
    :form-state="formState"
    :loading="loading"
    :rules="rules"
    :app-title="appTitle"
    :logo-url="logoUrl"
    @submit="handleSubmit"
  />
</template>

<script setup lang="ts">
import { reactive, computed, ref, onMounted, watch, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import type { Rule } from 'ant-design-vue/es/form/interface'
import { useUserStore } from '@/store/user'
import { usePermissionStore } from '@/store/permission'
import { useAppStore } from '@/store/app'
import { redirectToFirstAuthorizedMenu } from '@/utils/permission'
import { getImageUrl } from '@/utils/logo'
import LoginSplit from './components/login-split.vue'
import LoginCenter from './components/login-center.vue'
import type { LoginForm } from './types'
// 导入默认登录背景图片
import defaultLoginBg from '@/assets/images/bg/login.png'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const permissionStore = usePermissionStore()
const appStore = useAppStore()

// 手动设置登录类型：'center' 或 'split'
const loginType = ref<'center' | 'split'>('split')

// 应用标题、Logo 和背景图片（从 store 获取，供子组件使用）
const appTitle = computed(() => appStore.config.title || import.meta.env.VITE_APP_TITLE)
const logoUrl = computed(() => getImageUrl(appStore.getLogoUrl()))
const backgroundUrl = computed(() => {
  const bgUrl = appStore.getLoginBackgroundUrl()
  // 如果是默认的 @/ 路径，使用导入的图片
  if (bgUrl === '@/assets/images/bg/login.png' || bgUrl.includes('@/assets/images/bg/login.png')) {
    return defaultLoginBg
  }
  // 否则使用 getImageUrl 处理
  return getImageUrl(bgUrl)
})

// 预加载背景图片（优化 LCP）
let preloadLink: HTMLLinkElement | null = null

const setupImagePreload = (url: string) => {
  // 移除旧的预加载 link
  if (preloadLink) {
    document.head.removeChild(preloadLink)
    preloadLink = null
  }

  // 创建新的预加载 link
  preloadLink = document.createElement('link')
  preloadLink.rel = 'preload'
  preloadLink.as = 'image'
  preloadLink.href = url
  preloadLink.fetchPriority = 'high'
  document.head.appendChild(preloadLink)
}

// 监听背景图片 URL 变化，更新预加载
watch(
  backgroundUrl,
  newUrl => {
    if (loginType.value === 'split' && newUrl) {
      setupImagePreload(newUrl)
    }
  },
  { immediate: true }
)

// 组件挂载时设置预加载
onMounted(() => {
  if (loginType.value === 'split' && backgroundUrl.value) {
    setupImagePreload(backgroundUrl.value)
  }
})

// 组件卸载前清理预加载 link
onBeforeUnmount(() => {
  if (preloadLink) {
    document.head.removeChild(preloadLink)
    preloadLink = null
  }
})

// 表单状态（响应式，供子组件双向绑定）
const formState = reactive<LoginForm>({
  username: '',
  password: ''
})

// 表单验证规则
const rules: Record<keyof LoginForm, Rule[]> = {
  username: [
    { required: true, message: '请输入您的用户名', trigger: 'blur' },
    { min: 3, message: '用户名至少为 3 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入您的密码', trigger: 'blur' },
    { min: 6, message: '密码至少为 6 个字符', trigger: 'blur' }
  ]
}

// 加载状态
const loading = computed(() => userStore.loginLoading)

// 提交登录
const handleSubmit = async (formData: LoginForm) => {
  try {
    await userStore.loginWithCredentials(formData.username, formData.password)

    message.success('登录成功')

    // 如果有重定向参数，优先使用重定向参数
    const redirect = route.query.redirect as string
    if (redirect) {
      await router.replace(redirect)
      return
    }

    // 否则，跳转到用户有权限的第一个菜单页面
    const hasPermission = await redirectToFirstAuthorizedMenu(router, permissionStore)
    if (!hasPermission) {
      message.warning('您没有任何权限，请联系管理员')
    }
  } catch (error: any) {
    console.error('登录失败:', error)
    message.error(error.message || '登录失败，请检查您的用户名或密码')
  }
}
</script>
