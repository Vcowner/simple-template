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
import { useAppStore } from './store/app'
import { setFavicon, setPageTitle, getImageUrl } from './utils/logo'
import './assets/styles/main.scss'

const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(Antd)

// 初始化应用配置
const appStore = useAppStore()
appStore.init().then(() => {
  // 设置 favicon
  const faviconUrl = appStore.getFaviconUrl()
  if (faviconUrl) {
    setFavicon(getImageUrl(faviconUrl))
  }

  // 设置页面标题
  if (appStore.config.title) {
    setPageTitle(appStore.config.title)
  }
})

// 初始化用户 store
const userStore = useUserStore()
userStore.init()

app.mount('#app')
