/*
 * @Author: liaokt
 * @Description: 用户相关 store - 只管理用户基本信息，权限管理交给 permission store
 * @Date: 2025-12-01 15:34:35
 * @LastEditors: liaokt
 * @LastEditTime: 2025-12-12 16:52:21
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import router from '@/router'
import { login as loginAPI, logout as logoutAPI } from '@/api/user'
import { ROUTE_NAME } from '@/constants/route'
import { useLocalStorage } from '@/hooks'
import type { IUserInfo } from '@/types/user'
import { API_CODE } from '@/constants'
import { usePermissionStore } from './permission'

export const useUserStore = defineStore('user', () => {
  // 用户信息存储
  const {
    value: userInfoLocal,
    remove: removeUserInfoLocal,
    setValue: setUserInfoLocal
  } = useLocalStorage<IUserInfo | null>('userInfo', null)

  // Token 存储
  const {
    value: tokenLocal,
    remove: removeTokenLocal,
    setValue: setTokenLocal
  } = useLocalStorage<string | null>('token', null)

  // 状态
  const userInfo = ref<IUserInfo | null>(userInfoLocal.value)
  const token = ref<string | null>(tokenLocal.value)

  // actions

  // 设置用户信息
  const setUserInfo = (info: IUserInfo | null) => {
    userInfo.value = info
    setUserInfoLocal(info)
  }

  // 设置 Token
  const setToken = (newToken: string | null) => {
    token.value = newToken
    setTokenLocal(newToken)
  }

  // 登录
  const loginWithCredentials = async (username: string, password: string): Promise<void> => {
    try {
      // 调用登录 API
      const loginResponse = await loginAPI({ username, password })
      const { userInfo: info, token: newToken } = loginResponse

      // 分别设置用户信息和 Token
      setUserInfo(info)
      setToken(newToken)

      // 初始化权限数据（从接口获取权限）
      const permissionStore = usePermissionStore()
      await permissionStore.init()
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
        // 清除用户信息和 Token
        setUserInfo(null)
        setToken(null)
        removeUserInfoLocal()
        removeTokenLocal()

        // 重置权限数据
        const permissionStore = usePermissionStore()
        permissionStore.reset()

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
    token,
    isLoggedIn: computed(() => !!token.value),
    setUserInfo,
    setToken,
    loginWithCredentials,
    logout
  }
})
