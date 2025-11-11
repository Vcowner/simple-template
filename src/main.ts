/*
 * @Author: liaokt
 * @Description:
 * @Date: 2025-11-06 09:05:24
 * @LastEditors: liaokt
 * @LastEditTime: 2025-11-06 09:28:11
 */
import { createApp } from 'vue'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import App from './App.vue'
import router from './router'
import pinia from './store'
import { useUserStore } from './store/user'
import './assets/styles/style.css'

const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(Antd)

// 初始化用户 store
const userStore = useUserStore()
userStore.init()

app.mount('#app')
