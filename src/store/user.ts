/*
 * @Author: liaokt
 * @Description: 用户相关 store
 * @Date: 2025-12-01 15:34:35
 * @LastEditors: liaokt
 * @LastEditTime: 2025-12-12 16:52:21
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'
import router from '@/router'
import { login as loginAPI, logout as logoutAPI } from '@/api/user'
import { ROUTE_NAME } from '@/constants/route'
import { useLocalStorage } from '@/hooks'
import type { IUserInfo } from '@/types/user'
import { API_CODE } from '@/constants'

export const useUserStore = defineStore('user', () => {
  const {
    value: userInfoLocal,
    remove: removeUserInfoLocal,
    setValue: setUserInfoLocal
  } = useLocalStorage<IUserInfo | null>('userInfo', {
    id: '',
    name: '',
    token: '',
    avatar: ''
  })

  // 状态
  const userInfo = ref<IUserInfo | null>(userInfoLocal.value)

  // actions

  // 设置用户信息
  const setUserInfo = (info: IUserInfo | null) => {
    userInfo.value = info
    setUserInfoLocal(info)
  }

  // 登录
  const loginWithCredentials = async (username: string, password: string): Promise<void> => {
    try {
      // 调用登录 API
      const loginResponse = await loginAPI({ username, password })
      const { userInfo: info, token } = loginResponse

      // 设置登录状态
      setUserInfo({ ...info, token })
    } catch (error: any) {
      const errorMessage = error.message || '登录失败，请检查您的用户名或密码'
      throw new Error(errorMessage)
    }
  }

  // 登出
  const logout = async () => {
    try {
      const res = await logoutAPI()
      if (res.code === API_CODE.SUCCESS) {
        setUserInfo(null)
        removeUserInfoLocal()
        // 跳转到登录页面
        router.push({ name: ROUTE_NAME.LOGIN })
        return Promise.resolve()
      }
    } catch (error) {
      console.warn('登出接口调用失败:', error)
      return Promise.reject(error)
    }
  }

  return {
    userInfo,
    isLoggedIn: computed(() => !!userInfo.value?.token),
    setUserInfo,
    loginWithCredentials,
    logout
  }
})
