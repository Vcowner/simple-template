# Mock 数据说明

## 概述

项目使用 `vite-plugin-mock` 和 `mockjs` 来实现 Mock 数据功能。

## 配置

Mock 功能仅在开发环境（`NODE_ENV === 'development'`）启用。

## 目录结构

```
mock/
├── index.ts    # Mock 入口文件
├── user.ts     # 用户相关 Mock 接口
└── README.md   # 说明文档
```

## 使用方式

### 1. 创建 Mock 文件

在 `mock/` 目录下创建新的 Mock 文件，例如：

```typescript
// mock/example.ts
import type { MockMethod } from 'vite-plugin-mock'
import Mock from 'mockjs'

export default [
  {
    url: '/api/example',
    method: 'get',
    response: () => {
      return {
        code: 10200,
        message: '成功',
        data: {
          id: Mock.Random.id(),
          name: Mock.Random.cname()
        }
      }
    }
  }
] as MockMethod[]
```

### 2. 在 index.ts 中导入

```typescript
// mock/index.ts
import example from './example'

export default [...example]
```

## Mock 接口示例

### 用户相关接口

- `GET /api/user/:id` - 获取用户信息
- `GET /api/user/list` - 获取用户列表（支持分页）
- `POST /api/user/login` - 用户登录
- `POST /api/user/logout` - 用户登出
- `POST /api/user` - 创建用户
- `PUT /api/user/:id` - 更新用户
- `DELETE /api/user/:id` - 删除用户

### 测试账号

- 用户名: `admin`
- 密码: `123456`

## Mock.js 语法

Mock.js 提供了丰富的数据生成语法：

```javascript
Mock.Random.id()           // 随机 ID
Mock.Random.cname()        // 随机中文姓名
Mock.Random.email()        // 随机邮箱
Mock.Random.image()        // 随机图片
Mock.Random.datetime()     // 随机日期时间
Mock.Random.string()       // 随机字符串
```

更多用法请参考 [Mock.js 文档](https://github.com/nuysoft/Mock/wiki)

## 注意事项

1. Mock 仅在开发环境生效
2. 生产环境会自动禁用 Mock
3. API 路径需要以 `/api` 开头（根据实际配置调整）
4. 响应格式需要符合项目的 API 响应规范

