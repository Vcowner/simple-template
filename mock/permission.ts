/*
 * @Author: liaokt
 * @Description:
 * @Date: 2025-12-08 10:27:15
 * @LastEditors: liaokt
 * @LastEditTime: 2025-12-08 10:27:52
 */
import type { MockMethod } from 'vite-plugin-mock'
import { getBuiltPermissions } from '../src/config/permissions'

/**
 * 权限相关 Mock 接口
 */
export default [
  // 获取所有权限列表（旧接口，保持兼容）
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
  // 获取权限列表（支持查询参数）
  {
    url: '/api/permissions/',
    method: 'get',
    response: ({ query }) => {
      // 从配置文件获取权限数据
      const builtPermissions = getBuiltPermissions()
      // 转换为 Permission 格式（去掉 path 字段）
      let permissions = builtPermissions.map(({ path, ...perm }) => perm)

      // 按名称过滤
      if (query.name) {
        permissions = permissions.filter(p => p.name.includes(query.name))
      }

      // 按类型过滤
      if (query.type) {
        permissions = permissions.filter(p => p.type === query.type)
      }

      // 按父权限编码过滤
      if (query.parentCode) {
        permissions = permissions.filter(p => p.parentCode === query.parentCode)
      }

      return {
        code: 10200,
        message: '获取成功',
        data: {
          list: permissions,
          total: permissions.length
        }
      }
    }
  },
  // 创建权限
  {
    url: '/api/permissions/',
    method: 'post',
    response: ({ body }) => {
      const { code, name, type, parentCode } = body

      // 模拟创建权限
      const newPermission = {
        code,
        name,
        type,
        parentCode: parentCode || undefined
      }

      return {
        code: 10200,
        message: '创建成功',
        data: newPermission
      }
    }
  },
  // 更新权限
  {
    url: '/api/permissions/:code',
    method: 'put',
    response: ({ body }) => {
      // 模拟更新权限
      const updatedPermission = {
        ...body
      }

      return {
        code: 10200,
        message: '更新成功',
        data: updatedPermission
      }
    }
  },
  // 删除权限
  {
    url: '/api/permissions/:code',
    method: 'delete',
    response: () => {
      return {
        code: 10200,
        message: '删除成功'
      }
    }
  }
] as MockMethod[]
