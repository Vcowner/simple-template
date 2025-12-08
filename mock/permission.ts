/*
 * @Author: liaokt
 * @Description:
 * @Date: 2025-12-08 10:27:15
 * @LastEditors: liaokt
 * @LastEditTime: 2025-12-08 10:27:52
 */
import type { MockMethod } from 'vite-plugin-mock'
import { MOCK_PERMISSIONS, MOCK_ROLES } from '../src/config/permissions/mockData'
import { getBuiltPermissions } from '../src/config/permissions'

/**
 * 权限相关 Mock 接口
 */
export default [
  // 获取用户权限列表
  {
    url: '/api/user/permissions',
    method: 'get',
    response: () => {
      return {
        code: 10200,
        message: '获取成功',
        data: MOCK_PERMISSIONS
      }
    }
  },
  // 获取所有权限列表
  {
    url: '/api/permissions',
    method: 'get',
    response: () => {
      // 从配置文件获取权限数据
      const builtPermissions = getBuiltPermissions()
      // 转换为 Permission 格式（去掉 path 字段）
      const permissions = builtPermissions.map(({ path, ...perm }) => perm)

      return {
        code: 10200,
        message: '获取成功',
        data: permissions
      }
    }
  },
  // 获取所有角色列表
  {
    url: '/api/roles',
    method: 'get',
    response: () => {
      return {
        code: 10200,
        message: '获取成功',
        data: MOCK_ROLES
      }
    }
  }
] as MockMethod[]
