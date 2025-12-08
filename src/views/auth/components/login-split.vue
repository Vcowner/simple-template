<!--
 * @Author: liaokt
 * @Description: 
 * @Date: 2025-12-03 15:19:12
 * @LastEditors: liaokt
 * @LastEditTime: 2025-12-08 16:27:52
-->
<template>
  <div class="login-split" :style="cssVariables">
    <!-- 左侧登录表单区域 -->
    <div class="login-split__left">
      <!-- Logo和品牌 - 左上角 -->
      <div class="login-split__brand">
        <div class="login-split__logo">
          <img :src="props.logoUrl" alt="Logo" />
        </div>
        <span class="login-split__brand-name">{{ props.appTitle }}</span>
      </div>

      <div class="login-split__content">
        <!-- 标题 -->
        <div class="login-split__header">
          <h1 class="login-split__title">欢迎回来</h1>
          <p class="login-split__subtitle">请输入您的用户名和密码以访问您的账户。</p>
        </div>

        <!-- 登录表单 -->
        <a-form
          ref="formRef"
          layout="vertical"
          :model="localFormState"
          :rules="rules"
          class="login-split__form"
          @finish="handleSubmit"
        >
          <a-form-item label="用户名" name="username">
            <a-input
              v-model:value="localFormState.username"
              size="large"
              placeholder="请输入您的用户名"
              :maxlength="30"
              allow-clear
              class="login-split__input"
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
              placeholder="请输入您的密码"
              :maxlength="30"
              allow-clear
              class="login-split__input"
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
              class="login-split__submit"
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

    <!-- 右侧展示区域 -->
    <div class="login-split__right">
      <div class="login-split__image-wrapper">
        <img
          ref="backgroundImageRef"
          :src="props.backgroundUrl"
          alt="登录背景"
          class="login-split__image"
          loading="eager"
          decoding="async"
          fetchpriority="high"
          @load="handleImageLoad"
        />
      </div>
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
  backgroundUrl: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  submit: [formData: LoginForm]
}>()

const formRef = ref<FormInstance>()
const backgroundImageRef = ref<HTMLImageElement>()

// 获取主题色和阴影颜色
const { primaryColor, shadowColor30, shadowColor40 } = useThemeColor()

// 处理背景图片加载完成
const handleImageLoad = () => {
  if (backgroundImageRef.value) {
    backgroundImageRef.value.classList.add('loaded')
  }
}

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
@use '@/assets/styles/_variables' as vars;

.login-split {
  display: flex;
  min-height: 100vh;

  &__left {
    position: relative;
    display: flex;
    flex: 0 0 40%;
    flex-direction: column;
    justify-content: space-between;
    padding: 40px;
    background: vars.$app-background;
  }

  &__brand {
    display: flex;
    flex-shrink: 0;
    gap: 14px;
    align-items: center;
  }

  &__content {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 48px;
    justify-content: center;
    width: 100%;
    max-width: 480px;
    margin: -10% auto 0;
  }

  &__header {
    display: flex;
    flex-direction: column;
    gap: 12px;
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

  &__brand-name {
    font-size: 20px;
    font-weight: 800;
    color: #0f172a;
    letter-spacing: -0.5px;
  }

  &__title {
    margin: 0;
    font-size: 32px;
    font-weight: 800;
    line-height: 1.2;
    color: #0f172a;
    letter-spacing: -0.8px;
  }

  &__subtitle {
    margin: 0;
    font-size: 16px;
    line-height: 1.6;
    color: rgb(15 23 42 / 60%);
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: 36px;
  }

  &__input {
    :deep(.ant-input-affix-wrapper) {
      height: 56px;
      padding: 0 16px;
    }

    :deep(.ant-input),
    :deep(.ant-input-lg) {
      height: 28px;
      font-size: 15px;
      line-height: 28px;
    }
  }

  &__submit {
    height: 48px;
    font-size: 17px;
    font-weight: 600;
    border: none;
    border-radius: 10px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
      background: var(--button-primary-color) !important;
      box-shadow: 0 8px 20px var(--button-shadow-hover) !important;
      opacity: 0.9;
      transform: translateY(-2px);
    }

    &:active {
      background: var(--button-primary-color) !important;
      box-shadow: 0 2px 8px var(--button-shadow-active) !important;
      transform: translateY(0);
    }
  }

  &__right {
    position: relative;
    display: flex;
    flex: 0 0 60%;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  &__image-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: vars.$app-background;

    // 添加渐变背景作为占位符，提升视觉体验
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }

  &__image {
    position: relative;
    z-index: 1;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: right center;
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
    will-change: opacity;

    // 图片加载完成后淡入
    &.loaded {
      opacity: 1;
    }
  }
}

:deep(.ant-form-item) {
  margin-bottom: 0;
}

:deep(.ant-form-item-label > label) {
  font-size: 15px;
  font-weight: 600;
  color: #0f172a;
}

:deep(.ant-input-affix-wrapper) {
  border-color: rgb(15 23 42 / 15%);
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    border-color: rgb(102 126 234 / 50%);
    box-shadow: 0 0 0 2px rgb(102 126 234 / 10%);
  }

  &:focus,
  &.ant-input-affix-wrapper-focused {
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgb(102 126 234 / 15%);
  }
}

:deep(.ant-input-lg),
:deep(.ant-input-password-large .ant-input) {
  font-size: 14px;
}

:deep(.ant-input-prefix) {
  color: rgb(102 126 234 / 60%);
  transition: color 0.3s ease;
}

:deep(.ant-input-affix-wrapper:hover .ant-input-prefix) {
  color: #667eea;
}

:deep(.ant-input-affix-wrapper-focused .ant-input-prefix) {
  color: #667eea;
}

@media (width <= 1024px) {
  .login-split {
    &__left {
      flex: 1 1 100%;
      padding: 32px 24px;
    }

    &__right {
      display: none;
    }

    &__promo {
      padding: 32px 24px;
      margin: 16px;
      border-radius: 20px;
    }
  }
}

@media (width <= 768px) {
  .login-split {
    &__left {
      padding: 24px 20px;
    }

    &__brand-name {
      font-size: 18px;
    }

    &__title {
      font-size: 24px;
      letter-spacing: -0.4px;
    }

    &__subtitle {
      font-size: 14px;
    }

    &__form {
      gap: 28px;
    }

    &__input {
      :deep(.ant-input-affix-wrapper),
      :deep(.ant-input-affix-wrapper-lg) {
        height: 48px !important;
        padding: 0 14px;
      }

      :deep(.ant-input),
      :deep(.ant-input-lg) {
        height: 24px;
        font-size: 14px;
        line-height: 24px;
      }
    }

    &__submit {
      height: 44px;
      font-size: 15px;
    }
  }

  :deep(.ant-form-item-label > label) {
    font-size: 14px;
  }
}

@media (width <= 480px) {
  .login-split {
    &__left {
      padding: 20px 16px;
    }

    &__brand-name {
      font-size: 16px;
    }

    &__title {
      font-size: 20px;
      letter-spacing: -0.2px;
    }

    &__subtitle {
      font-size: 13px;
    }

    &__form {
      gap: 24px;
    }

    &__input {
      :deep(.ant-input-affix-wrapper),
      :deep(.ant-input-affix-wrapper-lg) {
        height: 44px !important;
        padding: 0 12px;
      }

      :deep(.ant-input),
      :deep(.ant-input-lg) {
        height: 22px;
        font-size: 13px;
        line-height: 22px;
      }
    }

    &__submit {
      height: 44px;
      font-size: 14px;
    }
  }

  :deep(.ant-form-item-label > label) {
    font-size: 13px;
  }
}
</style>
