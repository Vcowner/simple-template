<template>
  <div class="login" :style="cssVariables">
    <div class="login__card">
      <div class="login__brand">
        <div class="login__logo">
          <img :src="props.logoUrl" alt="Logo" />
        </div>
        <div class="login__title-group">
          <h3 class="login__title">{{ loginTitle }}</h3>
          <p class="login__subtitle">{{ props.appTitle }}</p>
        </div>
      </div>

      <a-form
        ref="formRef"
        layout="vertical"
        :model="localFormState"
        :rules="rules"
        @finish="handleSubmit"
      >
        <a-form-item label="用户名" name="username">
          <a-input
            v-model:value="localFormState.username"
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
            v-model:value="localFormState.password"
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

        <a-form-item>
          <a-button
            type="primary"
            size="large"
            class="login__submit"
            html-type="submit"
            :loading="loading"
            :style="buttonStyle"
            block
          >
            登录
          </a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormInstance } from 'ant-design-vue'
import type { Rule } from 'ant-design-vue/es/form/interface'
import { ref, watch, computed } from 'vue'
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
import { useThemeColor } from '@/hooks'
import type { LoginForm } from '../types'

interface Props {
  formState: LoginForm
  loading: boolean
  rules: Record<keyof LoginForm, Rule[]>
  appTitle: string
  logoUrl: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  submit: [formData: LoginForm]
}>()

const loginTitle = '登录'

const formRef = ref<FormInstance>()

// 获取主题色和阴影颜色
const { primaryColor, shadowColor30, shadowColor40 } = useThemeColor()

// 计算按钮样式
const buttonStyle = computed(() => {
  return {
    backgroundColor: primaryColor.value,
    borderColor: primaryColor.value,
    boxShadow: `0 4px 12px ${shadowColor30.value}`
  }
})

// 设置 CSS 变量用于样式中的 hover 和 active 状态
const cssVariables = computed(() => {
  return {
    '--button-primary-color': primaryColor.value,
    '--button-shadow-hover': shadowColor40.value,
    '--button-shadow-active': shadowColor30.value
  }
})

// 创建本地表单状态，避免直接修改 prop
const localFormState = ref<LoginForm>({
  username: props.formState.username,
  password: props.formState.password
})

// 同步 prop 变化到本地状态
watch(
  () => props.formState,
  newState => {
    localFormState.value = {
      username: newState.username,
      password: newState.password
    }
  },
  { deep: true }
)

const handleSubmit = async () => {
  if (!formRef.value) {
    return
  }

  try {
    await formRef.value.validateFields()
    emit('submit', { ...localFormState.value })
  } catch (error) {
    // 验证失败，不触发提交
    console.error('表单验证失败:', error)
  }
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
    width: 40px;
    height: 40px;
    transition: all 0.3s ease;

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }

  &__logo:hover {
    transform: scale(1.05);
  }

  &__title-group {
    display: flex;
    flex-direction: column;
    gap: 2px;
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
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
      background: var(--button-primary-color) !important;
      border-color: var(--button-primary-color) !important;
      box-shadow: 0 8px 20px var(--button-shadow-hover) !important;
      opacity: 0.9;
      transform: translateY(-2px);
    }

    &:active {
      background: var(--button-primary-color) !important;
      border-color: var(--button-primary-color) !important;
      box-shadow: 0 2px 8px var(--button-shadow-active) !important;
      transform: translateY(0);
    }
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
      width: 36px;
      height: 36px;
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
