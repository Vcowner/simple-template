/*
 * @Author: liaokt
 * @Description: 角色相关 Mock 接口
 * @Date: 2025-12-12
 */
import type { MockMethod } from 'vite-plugin-mock'
import { MOCK_ROLES } from './data/role'

/**
 * 角色相关 Mock 接口
 */
export default [
  // 获取所有角色列表（旧接口，保持兼容）
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
  },
  // 获取角色列表（支持查询参数）
  {
    url: '/api/roles/',
    method: 'get',
    response: ({ query }) => {
      let roles = [...MOCK_ROLES]

      // 按名称过滤
      if (query.name) {
        roles = roles.filter(r => r.name.includes(query.name))
      }

      // 按编码过滤
      if (query.code) {
        roles = roles.filter(r => r.code.includes(query.code))
      }

      // 按系统角色过滤
      if (query.isSystem !== undefined && query.isSystem !== '') {
        const isSystem = query.isSystem === 'true' || query.isSystem === true || query.isSystem === '1'
        roles = roles.filter(r => Boolean(r.isSystem) === isSystem)
      }

      // 添加创建时间（模拟数据）
      const rolesWithTime = roles.map(role => ({
        ...role,
        createTime: '2024-01-01 10:00:00'
      }))

      // 分页处理
      const page = parseInt(query.page) || 1
      const pageSize = parseInt(query.page_size) || parseInt(query.pageSize) || 10
      const total = rolesWithTime.length
      const start = (page - 1) * pageSize
      const end = start + pageSize
      const list = rolesWithTime.slice(start, end)

      return {
        code: 10200,
        message: '获取成功',
        data: {
          list,
          total
        }
      }
    }
  },
  // 创建角色
  {
    url: '/api/roles/',
    method: 'post',
    response: ({ body }) => {
      const { code, name, description, permissions, isSystem } = body

      // 模拟创建角色
      const newRole = {
        code,
        name,
        description: description || undefined,
        permissions: permissions || [],
        isSystem: isSystem || false,
        createTime: new Date().toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }).replace(/\//g, '-')
      }

      return {
        code: 10200,
        message: '创建成功',
        data: newRole
      }
    }
  },
  // 更新角色
  {
    url: '/api/roles/:code',
    method: 'put',
    response: ({ body }) => {
      // 模拟更新角色
      const updatedRole = {
        ...body
      }

      return {
        code: 10200,
        message: '更新成功',
        data: updatedRole
      }
    }
  },
  // 删除角色
  {
    url: '/api/roles/:code',
    method: 'delete',
    response: () => {
      return {
        code: 10200,
        message: '删除成功'
      }
    }
  }
] as MockMethod[]

