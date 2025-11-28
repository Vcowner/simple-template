<template>
  <div class="not-found">
    <div class="not-found-content">
      <div class="not-found-image-wrapper">
        <img src="@/assets/images/404.png" alt="404" class="not-found-image" />
      </div>
      <div class="not-found-text">
        <h1 class="not-found-title">哎呀！404 错误</h1>
        <p class="not-found-subtitle">抱歉，您访问的页面不存在或已被移除。让我们带您返回首页。</p>
      </div>
      <div class="not-found-actions">
        <a-button size="large" class="home-button" @click="goHome">
          <template #icon>
            <ArrowLeftOutlined />
          </template>
          返回首页
        </a-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ArrowLeftOutlined } from '@ant-design/icons-vue'

const router = useRouter()

const goHome = () => {
  router.push('/')
}
</script>

<style lang="scss" scoped>
$primary-color: #407cff;
$primary-hover: #3366e6;
$primary-active: #2d5bcc;
$text-primary: rgb(0 0 0 / 90%);
$text-secondary: rgb(0 0 0 / 70%);
$shadow-color: rgb(64 124 255 / 30%);

.not-found {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  min-height: 100vh;
  padding: 60px 20px 40px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);

  &-content {
    width: 100%;
    max-width: 600px;
    text-align: center;
  }

  &-image-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
    animation: fadeInScale 0.4s ease-out;
  }

  &-image {
    max-width: 100%;
    height: auto;
    max-height: 400px;
    object-fit: contain;
    filter: drop-shadow(0 10px 30px rgb(0 0 0 / 10%));
    animation: float 3s ease-in-out infinite 0.5s;
  }

  &-text {
    margin-top: -8px;
    margin-bottom: 32px;
    animation: fadeIn 0.3s ease-out;
  }

  &-title {
    margin-bottom: 16px;
    font-size: 36px;
    font-weight: 700;
    line-height: 1.2;
    color: $text-primary;
    letter-spacing: -0.5px;
  }

  &-subtitle {
    max-width: 500px;
    margin: 0;
    margin-right: auto;
    margin-left: auto;
    font-size: 16px;
    line-height: 1.6;
    color: $text-secondary;
  }

  &-actions {
    display: flex;
    gap: 16px;
    justify-content: center;
    animation: fadeIn 0.3s ease-out;
  }
}

.home-button {
  height: 48px;
  padding: 0 48px;
  font-size: 16px;
  font-weight: 500;
  color: #fff;
  background: $primary-color;
  border-color: $primary-color;
  border-radius: 8px;
  box-shadow: 0 4px 12px $shadow-color;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    background: $primary-hover;
    border-color: $primary-hover;
    box-shadow: 0 6px 16px rgb(64 124 255 / 40%);
    transform: translateY(-2px);
  }

  &:active {
    background: $primary-active;
    border-color: $primary-active;
    box-shadow: 0 2px 8px $shadow-color;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.9);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-10px);
  }
}

@media (width <= 768px) {
  .not-found {
    padding: 20px 16px;

    &-title {
      font-size: 28px;
    }

    &-subtitle {
      font-size: 16px;
    }

    &-image {
      max-height: 300px;
    }
  }

  .home-button {
    width: 100%;
    max-width: 300px;
    padding: 0 32px;
  }
}
</style>
