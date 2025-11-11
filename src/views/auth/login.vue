<template>
  <div class="login">
    <div class="login__card">
      <div class="login__brand">
        <div class="login__logo">PI</div>
        <div class="login__title-group">
          <h1 class="login__title">{{ appTitle }}</h1>
          <p class="login__subtitle">请登录以继续使用系统</p>
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
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
import { useUserStore } from '@/store/user'

interface LoginForm {
  username: string
  password: string
  remember: boolean
}

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
$card-shadow: 0 24px 48px rgba(15, 23, 42, 0.12);
$text-muted: rgba(15, 23, 42, 0.6);

.login {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 16px;
  background: $bg-gradient;

  &__card {
    width: min(480px, 100%);
    background: #fff;
    border-radius: 24px;
    padding: 40px 48px;
    box-shadow: $card-shadow;
    display: flex;
    flex-direction: column;
    gap: 32px;
  }

  &__brand {
    display: flex;
    align-items: center;
    gap: 24px;
  }

  &__logo {
    width: 56px;
    height: 56px;
    border-radius: 16px;
    background: rgba(64, 124, 255, 0.12);
    color: #407cff;
    font-weight: 700;
    font-size: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__title-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  &__title {
    font-size: 24px;
    font-weight: 700;
    color: #0f172a;
    margin: 0;
  }

  &__subtitle {
    margin: 0;
    color: $text-muted;
    font-size: 14px;
  }

  &__options {
    display: flex;
    justify-content: space-between;
    align-items: center;
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
    border-radius: 10px;
    border: 1px solid #d9d9d9;
    color: #0f172a;
    background-color: #fff;
  }

  &__footer {
    text-align: center;
    color: $text-muted;
    font-size: 13px;

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

@media (max-width: 768px) {
  .login {
    &__card {
      padding: 32px 24px;
      gap: 24px;
    }

    &__brand {
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
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
      align-items: flex-start;
      gap: 8px;
    }
  }
}
</style>
