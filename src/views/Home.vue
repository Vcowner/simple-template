<template>
  <div class="home">
    <section class="intro">
      <h2>欢迎使用</h2>
      <p>这是一个基于 Vue 3 + Vite 的前端模板，你可以基于它快速开始你的项目。</p>
    </section>

    <section class="demo">
      <h2>交互示例</h2>
      <button class="btn" @click="handleClick">点击我</button>
      <p v-if="clickCount > 0" class="demo-text" :class="{ 'fade-in': showText }">
        你已经点击了 {{ clickCount }} 次！
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'

const clickCount = ref<number>(0)
const showText = ref<boolean>(false)

const handleClick = (): void => {
  clickCount.value++
  showText.value = false
  nextTick(() => {
    showText.value = true
  })

  // 控制台欢迎信息
  if (clickCount.value === 1) {
    console.log(
      '%c欢迎使用 Simple Template!',
      'color: #667eea; font-size: 20px; font-weight: bold;'
    )
    console.log('%c这是一个基于 Vue 3 的前端模板项目', 'color: #764ba2; font-size: 14px;')
  }
}
</script>

<style scoped>
.fade-in {
  animation: fadeIn 0.5s ease;
}
</style>
