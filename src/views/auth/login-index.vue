<!--
 * @Author: liaokt
 * @Description: 登录页面
 * @Date: 2025-12-03 16:47:39
 * @LastEditors: liaokt
 * @LastEditTime: 2025-12-16 10:22:42
-->
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
import { reactive, computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import type { Rule } from 'ant-design-vue/es/form/interface'
import { useUserStore } from '@/store/modules/user'
import { usePermissionStore } from '@/store/modules/permission'
import { useAppStore } from '@/store/modules/app'
import { getImageUrl } from '@/utils/logo'
import { redirectToFirstAuthorizedMenu } from '@/utils/permission'
import LoginSplit from './components/login-split.vue'
import LoginCenter from './components/login-center.vue'
import type { LoginForm } from './types'
// 导入默认登录背景图片
import defaultLoginBg from '@/assets/images/bg/login.png'

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
const loading = ref(false)

// 提交登录
const handleSubmit = async (formData: LoginForm) => {
  await userStore.loginWithCredentials(formData.username, formData.password)

  message.success('登录成功')

  // 跳转到第一个有权限的菜单
  const redirected = await redirectToFirstAuthorizedMenu(router, permissionStore)
  if (!redirected) {
    // 如果没有找到有权限的菜单，跳转到首页
    router.push({ path: '/' })
  }
}
</script>
