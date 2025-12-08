import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import router from '@/router'
import type { UserInfo } from '@/types/user'
import { login as loginAPI, logout as logoutAPI, getUserInfo } from '@/api/user'
import { getUserPermissions } from '@/api/permission'
import { ROUTE_NAME } from '@/constants/route'

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

  /**
   * 获取并设置用户权限
   * @param userInfoData 用户信息对象
   */
  const fetchAndSetUserPermissions = async (userInfoData: UserInfo): Promise<void> => {
    // 如果用户信息中已有权限，直接返回
    if (
      userInfoData.permissions &&
      Array.isArray(userInfoData.permissions) &&
      userInfoData.permissions.length > 0
    ) {
      return
    }

    // 从 API 获取用户权限
    try {
      const permissions = await getUserPermissions()
      if (permissions && Array.isArray(permissions) && permissions.length > 0) {
        userInfoData.permissions = permissions
      }
    } catch (error) {
      console.warn('获取用户权限失败:', error)
    }
  }

  // 通过用户名和密码登录
  const loginWithCredentials = async (username: string, password: string): Promise<void> => {
    loginLoading.value = true

    try {
      // 调用登录 API
      const loginResponse = await loginAPI({ username, password })
      const { token: tokenValue, userInfo: info, permissions } = loginResponse

      // 设置权限：优先使用登录响应中的权限，否则从 API 获取
      if (permissions && Array.isArray(permissions) && permissions.length > 0) {
        info.permissions = permissions
      } else {
        await fetchAndSetUserPermissions(info)
      }

      // 设置登录状态
      login(tokenValue, info)
    } catch (error: any) {
      const errorMessage = error.message || '登录失败，请检查您的用户名或密码'
      throw new Error(errorMessage)
    } finally {
      loginLoading.value = false
    }
  }

  // 登出
  const logout = async () => {
    try {
      await logoutAPI()
    } catch (error) {
      console.warn('登出接口调用失败:', error)
    } finally {
      // 无论接口调用成功与否，都清除本地状态
      setToken('')
      setUserInfo(null)
      localStorage.removeItem('token')

      // 跳转到登录页面
      router.push({ name: ROUTE_NAME.LOGIN })
    }
  }

  // 初始化（从 localStorage 读取 token 并获取用户信息）
  const init = async () => {
    const storedToken = localStorage.getItem('token')
    if (!storedToken) {
      return
    }

    token.value = storedToken

    try {
      // 获取用户信息
      const userInfoData = await getUserInfo()
      if (userInfoData) {
        // 获取并设置用户权限
        await fetchAndSetUserPermissions(userInfoData)
        setUserInfo(userInfoData)
      }
    } catch (error) {
      console.warn('获取用户信息失败，清除 token:', error)
      // 如果获取用户信息失败，清除 token
      setToken('')
      localStorage.removeItem('token')
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
