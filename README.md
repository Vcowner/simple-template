# Simple Template

一个基于 Vue 3 + TypeScript + Vite 的现代化前端模板项目，集成了常用的开发工具和最佳实践。

## ✨ 特性

- 🎨 **Vue 3** - 使用最新的 Composition API
- 📘 **TypeScript** - 完整的类型支持
- ⚡ **Vite** - 极速的开发体验
- 🎯 **Ant Design Vue 4** - 企业级 UI 组件库
- 🛣️ **Vue Router** - 官方路由管理器
- 🗃️ **Pinia** - 新一代状态管理
- 📦 **Axios** - HTTP 请求封装
- 🔍 **ESLint + Prettier** - 代码规范和格式化
- 🐶 **Husky** - Git hooks 管理
- 📝 **TypeScript** - 类型安全

## 🚀 快速开始

### 1. 安装依赖

```bash
pnpm install
# 或
npm install
# 或
yarn install
```

### 2. 配置环境变量

复制环境变量模板文件：

```bash
cp .env.example .env.development
```

根据需要修改 `.env.development` 中的配置。

### 3. 启动开发服务器

```bash
pnpm dev
# 或
npm run dev
```

在浏览器中打开: http://localhost:8080

### 4. 构建生产版本

```bash
pnpm build
# 或
npm run build
```

构建文件将输出到 `dist/` 目录。

### 5. 预览生产构建

```bash
pnpm preview
# 或
npm run preview
```

## 📚 文档

- [代码规范文档](./docs/CODE_STANDARDS.md) - 详细的代码规范和最佳实践

## 📁 项目结构

```
simple-template/
├── public/                 # 静态资源
├── src/
│   ├── api/               # API 接口
│   │   ├── example.ts     # 接口示例
│   │   └── index.ts       # 接口导出
│   ├── assets/            # 资源文件
│   │   └── style.css      # 全局样式
│   ├── components/        # 组件
│   ├── hooks/             # 组合式函数
│   │   ├── useRequest.ts  # 请求管理 Hook
│   │   └── index.ts
│   ├── router/            # 路由配置
│   │   └── index.ts
│   ├── store/             # Pinia 状态管理
│   │   ├── index.ts       # Store 入口
│   │   └── user.ts        # 用户 Store
│   ├── utils/             # 工具函数
│   │   └── request/       # 请求封装
│   │       ├── index.ts
│   │       ├── request.ts # Axios 封装
│   │       └── types.ts   # 类型定义
│   ├── views/             # 页面组件
│   │   ├── Home.vue       # 首页
│   │   └── NotFound.vue   # 404 页面
│   ├── App.vue            # 根组件
│   ├── env.d.ts           # 环境变量类型
│   └── main.ts            # 入口文件
├── .env.example           # 环境变量示例
├── .env.development       # 开发环境变量
├── .env.production        # 生产环境变量
├── .eslintrc.cjs          # ESLint 配置
├── .prettierrc            # Prettier 配置
├── .husky/                # Git hooks
├── tsconfig.json          # TypeScript 配置
├── vite.config.ts         # Vite 配置
└── package.json
```

## 🛠️ 开发工具

### 代码检查

```bash
# 运行 ESLint 检查
pnpm lint

# 代码格式化
pnpm format

# TypeScript 类型检查
pnpm type-check
```

### Git Hooks

项目已配置 Husky，在提交代码时会自动：
- 运行 ESLint 检查
- 格式化代码（Prettier）
- 只检查暂存的文件（lint-staged）

## 📦 主要依赖

### 核心依赖

- `vue@^3.4.0` - Vue 3 框架
- `vue-router@^4.2.5` - 路由管理
- `pinia@^3.0.4` - 状态管理
- `ant-design-vue@4` - UI 组件库
- `@ant-design/icons-vue@^7.0.1` - 图标库
- `axios@^1.6.0` - HTTP 客户端

### 开发依赖

- `typescript@^5.3.0` - TypeScript
- `vite@^5.0.0` - 构建工具
- `@vitejs/plugin-vue@^5.0.0` - Vue 插件
- `eslint@^8.57.0` - 代码检查
- `prettier@^3.2.0` - 代码格式化
- `husky@^9.1.7` - Git hooks
- `lint-staged@^16.2.6` - 暂存文件检查

## 🎯 功能特性

### 请求封装

- 统一的请求/响应拦截器
- Token 自动添加
- CSRF Token 处理
- 错误统一处理
- 防抖错误提示

### 状态管理

- Pinia 状态管理
- 用户信息管理
- Token 持久化

### 路由守卫

- 登录验证
- 权限控制
- 页面标题设置

### 工具函数

- `useRequest` Hook - 请求管理
- 响应处理工具函数
- 类型定义完善

## 📝 使用示例

### 使用 API 请求

```typescript
import { request } from '@/utils/request'
import type { Result } from '@/utils/request'

// GET 请求
const getUserInfo = async (id: number) => {
  const result = await request.get<Result<UserInfo>>(`/user/${id}`)
  return result
}

// POST 请求
const createUser = async (data: UserData) => {
  const result = await request.post<Result<UserInfo>>('/user', data)
  return result
}
```

### 使用状态管理

```typescript
import { useUserStore } from '@/store/user'

const userStore = useUserStore()

// 登录
userStore.login(token, userInfo)

// 登出
userStore.logout()

// 获取用户信息
const isLoggedIn = userStore.isLoggedIn
```

### 使用 useRequest Hook

```typescript
import { useRequest } from '@/hooks'
import { getUserInfo } from '@/api'

const { loading, data, error, run } = useRequest(
  (id: number) => getUserInfo(id),
  {
    manual: true,
    onSuccess: (data) => {
      console.log('获取成功', data)
    }
  }
)

// 触发请求
run(123)
```

## 🔧 配置说明

### 环境变量

在 `.env.development` 或 `.env.production` 中配置：

```env
VITE_BASE_URL=http://localhost:3000/api
VITE_APP_TITLE=Simple Template
VITE_APP_ENV=development
```

### Ant Design Vue 主题

可以在 `src/assets/style.css` 中自定义主题变量。

## 📄 许可证

MIT License

---

**Happy Coding! 🎉**
