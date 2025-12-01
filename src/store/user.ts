import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface UserInfo {
  id: number
  name: string
  email: string
  avatar?: string
  roles?: string[]
}

export const useUserStore = defineStore('user', () => {
  // 状态
  const token = ref<string>('')
  const userInfo = ref<UserInfo | null>(null)
  const isLoggedIn = computed(() => !!token.value)

  // 设置 token
  const setToken = (newToken: string) => {
    token.value = newToken
    if (newToken) {
      localStorage.setItem('token', newToken)
    } else {
      localStorage.removeItem('token')
    }
  }

  // 设置用户信息
  const setUserInfo = (info: UserInfo | null) => {
    userInfo.value = info
  }

  // 登录
  const login = (tokenValue: string, info: UserInfo) => {
    setToken(tokenValue)
    setUserInfo(info)
  }

  // 登出
  const logout = () => {
    setToken('')
    setUserInfo(null)
    localStorage.removeItem('token')
  }

  // 初始化（从 localStorage 读取 token）
  const init = () => {
    const storedToken = localStorage.getItem('token')
    if (storedToken) {
      token.value = storedToken
    }
  }

  return {
    token,
    userInfo,
    isLoggedIn,
    setToken,
    setUserInfo,
    login,
    logout,
    init
  }
})
