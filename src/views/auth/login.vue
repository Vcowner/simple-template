<template>
  <div class="login">
    <div class="login__card">
      <div class="login__brand">
        <div class="login__logo">
          <ClusterOutlined />
        </div>
        <div class="login__title-group">
          <h3 class="login__title">{{ loginTitle }}</h3>
          <p class="login__subtitle">{{ appTitle }}</p>
        </div>
      </div>

      <a-form
        ref="formRef"
        layout="vertical"
        :model="formState"
        :rules="rules"
        @finish="handleSubmit"
      >
        <a-form-item label="用户名" name="username">
          <a-input
            v-model:value="formState.username"
            size="large"
            placeholder="请输入用户名"
            :maxlength="30"
            allow-clear
          >
            <template #prefix>
              <UserOutlined />
            </template>
          </a-input>
        </a-form-item>

        <a-form-item label="密码" name="password">
          <a-input-password
            v-model:value="formState.password"
            size="large"
            placeholder="请输入密码"
            :maxlength="30"
            allow-clear
          >
            <template #prefix>
              <LockOutlined />
            </template>
          </a-input-password>
        </a-form-item>

        <div class="login__options">
          <a-checkbox v-model:checked="formState.remember">记住我</a-checkbox>
          <a-typography-link @click="handleForgot">忘记密码？</a-typography-link>
        </div>

        <a-form-item>
          <a-button
            type="primary"
            size="large"
            class="login__submit"
            html-type="submit"
            :loading="loading"
            block
          >
            登录
          </a-button>
        </a-form-item>
      </a-form>

      <div class="login__footer">
        还没有账号？<a-typography-link @click="handleRegister">立即注册</a-typography-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormInstance } from 'ant-design-vue'
import type { Rule } from 'ant-design-vue/es/form/interface'
import { reactive, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { UserOutlined, LockOutlined, ClusterOutlined } from '@ant-design/icons-vue'
import { useUserStore } from '@/store/user'

interface LoginForm {
  username: string
  password: string
  remember: boolean
}

const loginTitle = '系统登录'
const appTitle = computed(() => import.meta.env.VITE_APP_TITLE)

const formRef = ref<FormInstance>()
const loading = ref(false)
const formState = reactive<LoginForm>({
  username: '',
  password: '',
  remember: true
})

const rules: Record<keyof LoginForm, Rule[]> = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, message: '用户名至少为 3 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少为 6 个字符', trigger: 'blur' }
  ],
  remember: []
}

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const handleSubmit = async () => {
  if (!formRef.value) {
    return
  }

  loading.value = true

  try {
    await formRef.value.validateFields()

    // 模拟登录请求
    await new Promise(resolve => setTimeout(resolve, 800))

    userStore.login(`token-${Date.now()}`, {
      id: Date.now(),
      name: formState.username,
      email: `${formState.username}@example.com`
    })

    if (!formState.remember) {
      userStore.setToken('')
    }

    message.success('登录成功')
    const redirect = (route.query.redirect as string) || '/'
    await router.replace(redirect)
  } catch (error) {
    console.error('登录失败:', error)
    message.error('登录失败，请检查用户名或密码')
  } finally {
    loading.value = false
  }
}

const handleForgot = () => {
  message.info('请联系管理员重置密码')
}

const handleRegister = () => {
  message.info('注册功能暂未开放')
}
</script>

<style lang="scss" scoped>
$bg-gradient: linear-gradient(135deg, #eef2ff 0%, #e0ecff 100%);
$card-shadow: 0 24px 48px rgb(15 23 42 / 12%);
$text-muted: rgb(15 23 42 / 60%);

.login {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 40px 16px;
  background: $bg-gradient;

  &__card {
    display: flex;
    flex-direction: column;
    gap: 32px;
    width: min(480px, 100%);
    padding: 40px 48px;
    background: #fff;
    border-radius: 24px;
    box-shadow: $card-shadow;
  }

  &__brand {
    display: flex;
    gap: 20px;
    align-items: center;
  }

  &__logo {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    font-size: 24px;
    color: #fff;
    background: #0f3a8d;
    border-radius: 50%;
  }

  &__title-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
    max-width: none;
  }

  &__title {
    margin: 0;
    font-size: 22px;
    font-weight: 700;
    color: #0f172a;
  }

  &__subtitle {
    margin: 0;
    font-size: 16px;
    line-height: 1.4;
    color: $text-muted;
  }

  &__options {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;

    .ant-typography {
      font-size: 13px;
    }
  }

  &__actions {
    display: flex;
    gap: 12px;
  }

  &__submit {
    height: 48px;
    font-size: 16px;
    font-weight: 600;
    border-radius: 10px;
  }

  &__clear {
    height: 48px;
    font-size: 16px;
    font-weight: 600;
    color: #0f172a;
    background-color: #fff;
    border: 1px solid #d9d9d9;
    border-radius: 10px;
  }

  &__footer {
    font-size: 13px;
    color: $text-muted;
    text-align: center;

    .ant-typography {
      font-weight: 600;
    }
  }
}

:deep(.ant-form-item-label > label) {
  font-weight: 500;
  color: #0f172a;
}

:deep(.ant-input-affix-wrapper) {
  border-radius: 10px;
}

:deep(.ant-input-lg),
:deep(.ant-input-password-large .ant-input) {
  font-size: 14px;
}

@media (width <= 768px) {
  .login {
    &__card {
      gap: 24px;
      padding: 32px 24px;
    }

    &__brand {
      flex-direction: column;
      gap: 16px;
      align-items: flex-start;
    }

    &__logo {
      width: 48px;
      height: 48px;
      font-size: 20px;
    }

    &__title {
      font-size: 20px;
    }

    &__subtitle {
      font-size: 13px;
    }

    &__options {
      flex-direction: column;
      gap: 8px;
      align-items: flex-start;
    }
  }
}
</style>
