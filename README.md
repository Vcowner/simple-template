# 电力物联终端设备流量特征识别系统

本项目基于 **Vue 3 + TypeScript + Vite** 构建，围绕电力物联终端设备的网络流量识别与分析场景，提供了开箱即用的开发脚手架、登录页面、404 页面等基础功能，适合作为企业级前端项目模板。

## ✨ 特性

- 🎨 **Vue 3** + Composition API，现代响应式开发体验
- 📘 **TypeScript** 全量类型支持，提升可维护性
- ⚡ **Vite 5** 极速冷启动与热更新
- 🎯 **Ant Design Vue 4** 搭建企业级 UI
- 🛣️ **Vue Router 4** + 路由守卫
- 🗃️ **Pinia 3** 状态管理
- 📦 **Axios** 请求封装，支持鉴权拦截
- 🔍 **ESLint + Prettier + Husky + lint-staged** 统一代码规范

## 🚀 快速开始

### 1. 安装依赖

```bash
pnpm install
# or
npm install
# or
yarn install
```

### 2. 配置环境变量

项目将公共配置放在 `.env`，并分别通过 `.env.development`、`.env.production` 覆盖环境特定变量：

```bash
# 建议复制并修改示例文件
cp .env.example .env
cp .env.example .env.development
cp .env.example .env.production
```

配置完成后，根据需要调整以下文件：

- `.env`：统一维护应用标题等公共变量
- `.env.development`：开发环境独有变量（如本地 API 地址）
- `.env.production`：生产环境独有变量（如在线 API 地址）

### 3. 启动开发服务器

```bash
pnpm dev
# or
npm run dev
```

浏览器访问：http://localhost:8080

### 4. 构建与预览

```bash
# 构建生产包
pnpm build

# 本地预览生产包
pnpm preview
```

构建产物位于 `dist/` 目录。

## 📁 项目结构

```text
power-iot-traffic/
├── public/                     # 静态资源
├── src/
│   ├── api/                    # API 接口示例
│   ├── assets/
│   │   ├── images/             # 图片资源
│   │   └── styles/style.css    # 全局样式
│   ├── components/             # 通用组件
│   ├── config/                 # 配置中心（主题等）
│   ├── constants/              # 常量定义
│   ├── hooks/                  # 组合式函数
│   ├── router/                 # 路由配置
│   ├── store/                  # Pinia 状态管理
│   ├── utils/                  # 工具函数
│   ├── views/
│   │   ├── auth/login.vue      # 登录页
│   │   ├── error/not-found.vue # 404 页面
│   │   └── Home.vue            # 首页
│   ├── App.vue                 # 根组件
│   └── main.ts                 # 入口文件
├── .env                        # 公共环境变量
├── .env.development            # 开发环境变量
├── .env.production             # 生产环境变量
├── .env.example                # 环境变量示例
├── README.md
└── package.json
```

## 🛠️ 开发命令

```bash
# 代码检查
pnpm lint

# 代码格式化
pnpm format

# TypeScript 类型检查
pnpm type-check
```

提交代码时，Husky 会自动执行 ESLint 与 Prettier，仅校验暂存区文件，保障提交质量。

## 📦 主要依赖版本

| 依赖           | 版本   |
| -------------- | ------ |
| Vue            | ^3.4.0 |
| Vue Router     | ^4.2.5 |
| Pinia          | ^3.0.4 |
| Ant Design Vue | 4.x    |
| Axios          | ^1.6.0 |
| TypeScript     | ^5.3.0 |
| Vite           | ^5.0.0 |

## 🔧 环境变量说明

```env
# .env
VITE_APP_TITLE=电力物联终端设备流量特征识别系统

# .env.development
VITE_BASE_URL=http://localhost:3000/api
VITE_APP_ENV=development

# .env.production
VITE_BASE_URL=/api
VITE_APP_ENV=production
```

> 建议仅在 `.env` 中维护公共变量，减少多处同步的成本。

## 🧩 页面说明

- `views/auth/login.vue`：登录页面，集成 Ant Design 表单验证
- `views/error/not-found.vue`：自定义 404 页面，包含动画元素
- `views/Home.vue`：首页示例，可根据业务扩展

## 📝 示例代码

### 使用 API 请求

```ts
import { request } from '@/utils/request'
import type { Result } from '@/utils/request'

export const getUserInfo = async (id: number) => {
  return request.get<Result<UserInfo>>(`/user/${id}`)
}
```

### 使用状态管理

```ts
import { useUserStore } from '@/store/user'

const userStore = useUserStore()
userStore.login(token, userInfo)
```

## 📄 许可证

MIT License

---

欢迎提交 Issue 或 PR，共同完善电力物联终端设备流量特征识别系统！
