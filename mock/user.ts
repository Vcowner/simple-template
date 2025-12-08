import type { MockMethod } from 'vite-plugin-mock'
import Mock from 'mockjs'
import { MOCK_PERMISSIONS } from '../src/config/permissions/mockData'

export default [
  // 获取用户信息
  {
    url: '/api/user/:id',
    method: 'get',
    response: ({ query }) => {
      return {
        code: 10200,
        message: '获取成功',
        data: {
          id: query.id || Mock.Random.id(),
          name: Mock.Random.cname(),
          email: Mock.Random.email(),
          avatar: Mock.Random.image('200x200', '#667eea', '#fff', 'avatar'),
          phone: Mock.Random.string('number', 11),
          roles: ['admin'],
          permissions: MOCK_PERMISSIONS
        }
      }
    }
  },
  // 获取用户列表
  {
    url: '/api/user/list',
    method: 'get',
    response: ({ query }) => {
      const page = parseInt(query.page) || 1
      const pageSize = parseInt(query.pageSize) || 10

      const list = Mock.mock({
        [`list|${pageSize}`]: [
          {
            id: '@id',
            name: '@cname',
            email: '@email',
            avatar: '@image("200x200")',
            phone: '@string("number", 11)',
            roles: ['admin', 'user'],
            'status|1': [0, 1],
            createTime: '@datetime'
          }
        ]
      })

      return {
        code: 10200,
        message: '获取成功',
        data: {
          list: list.list,
          total: 100,
          page,
          pageSize
        }
      }
    }
  },
  // 用户登录（统一使用 /api/auth/login）
  {
    url: '/api/auth/login',
    method: 'post',
    response: ({ body }) => {
      const { username, password } = body

      if (username === 'admin' && password === '123456') {
        return {
          code: 10200,
          message: '登录成功',
          data: {
            token: Mock.Random.string('upper', 32),
            refreshToken: Mock.Random.string('upper', 32),
            userInfo: {
              id: 1,
              name: '管理员',
              email: 'admin@example.com',
              avatar: Mock.Random.image('200x200'),
              roles: ['admin'],
              permissions: MOCK_PERMISSIONS
            },
            permissions: MOCK_PERMISSIONS, // 登录响应中直接返回权限列表
            expiresIn: 7200
          }
        }
      } else {
        return {
          code: 10401,
          message: '用户名或密码错误'
        }
      }
    }
  },
  // 用户登出（统一使用 /api/auth/logout）
  {
    url: '/api/auth/logout',
    method: 'post',
    response: () => {
      return {
        code: 10200,
        message: '登出成功'
      }
    }
  },
  // 获取当前用户信息
  {
    url: '/api/user/info',
    method: 'get',
    response: () => {
      return {
        code: 10200,
        message: '获取成功',
        data: {
          id: 1,
          name: '管理员',
          email: 'admin@example.com',
          avatar: Mock.Random.image('200x200'),
          roles: ['admin'],
          permissions: MOCK_PERMISSIONS
        }
      }
    }
  },
  // 创建用户
  {
    url: '/api/user',
    method: 'post',
    response: ({ body }) => {
      return {
        code: 10200,
        message: '创建成功',
        data: {
          id: Mock.Random.id(),
          ...body,
          createTime: Mock.Random.datetime()
        }
      }
    }
  },
  // 更新用户
  {
    url: '/api/user/:id',
    method: 'put',
    response: ({ body }) => {
      return {
        code: 10200,
        message: '更新成功',
        data: {
          ...body,
          updateTime: Mock.Random.datetime()
        }
      }
    }
  },
  // 删除用户
  {
    url: '/api/user/:id',
    method: 'delete',
    response: () => {
      return {
        code: 10200,
        message: '删除成功'
      }
    }
  }
] as MockMethod[]
