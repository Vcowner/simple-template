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
    url: '/api/user/',
    method: 'get',
    response: ({ query }) => {
      const page = parseInt(query.page) || 1
      const pageSize = parseInt(query.page_size) || parseInt(query.pageSize) || 10
      const username = query.username
      const status =
        query.status !== undefined && query.status !== '' ? parseInt(query.status) : undefined

      // 生成模拟数据（生成足够多的数据用于分页和过滤）
      const allMockData = Mock.mock({
        [`list|50`]: [
          {
            id: '@id',
            username: '@word(5,10)',
            nickname: '@cname',
            email: '@email',
            phone: () => `1${Mock.Random.integer(3, 9)}${Mock.Random.string('number', 9)}`,
            'status|1': [0, 1],
            'role|1': ['admin', 'user'],
            createTime: '@datetime("yyyy-MM-dd HH:mm:ss")'
          }
        ]
      }).list

      // 添加一些固定的测试数据
      const fixedData = [
        {
          id: '1',
          username: 'admin',
          nickname: '管理员',
          email: 'admin@example.com',
          phone: '13800138000',
          status: 1,
          role: 'admin',
          createTime: '2024-01-01 10:00:00'
        },
        {
          id: '2',
          username: 'user001',
          nickname: '普通用户',
          email: 'user001@example.com',
          phone: '13800138001',
          status: 1,
          role: 'user',
          createTime: '2024-01-02 10:00:00'
        },
        {
          id: '3',
          username: 'user002',
          nickname: '测试用户',
          email: 'user002@example.com',
          phone: '13800138002',
          status: 0,
          role: 'user',
          createTime: '2024-01-03 10:00:00'
        }
      ]

      // 合并固定数据和模拟数据
      let filteredData = [...fixedData, ...allMockData]

      // 按用户名过滤
      if (username) {
        filteredData = filteredData.filter(
          item => item.username.includes(username) || item.nickname.includes(username)
        )
      }

      // 按状态过滤
      if (status !== undefined) {
        filteredData = filteredData.filter(item => item.status === status)
      }

      // 分页处理
      const total = filteredData.length
      const start = (page - 1) * pageSize
      const end = start + pageSize
      const list = filteredData.slice(start, end)

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
