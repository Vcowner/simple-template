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
  const loginLoading = ref(false)
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

  // 登录（直接设置 token 和用户信息）
  const login = (tokenValue: string, info: UserInfo) => {
    setToken(tokenValue)
    setUserInfo(info)
  }

  // 通过用户名和密码登录
  const loginWithCredentials = async (username: string, _password: string): Promise<void> => {
    loginLoading.value = true

    try {
      // TODO: 替换为实际的后端 API 调用
      // const response = await axios.post('/api/auth/login', { username, password })
      // const { token: tokenValue, userInfo: info } = response.data
      // login(tokenValue, info)

      // 模拟登录请求
      await new Promise(resolve => setTimeout(resolve, 800))

      // 模拟登录成功
      login(`token-${Date.now()}`, {
        id: Date.now(),
        name: username,
        email: `${username}@example.com`
      })
    } catch (error: any) {
      throw new Error(error.message || '登录失败，请检查您的用户名或密码')
    } finally {
      loginLoading.value = false
    }
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
    loginLoading,
    isLoggedIn,
    setToken,
    setUserInfo,
    login,
    loginWithCredentials,
    logout,
    init
  }
})
