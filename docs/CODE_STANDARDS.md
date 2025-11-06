# 代码规范文档

本文档定义了项目的代码规范，所有开发人员都应该遵循这些规范。

## 📋 目录

- [代码风格](#代码风格)
- [命名规范](#命名规范)
- [文件组织](#文件组织)
- [TypeScript 规范](#typescript-规范)
- [Vue 组件规范](#vue-组件规范)
- [Git 提交规范](#git-提交规范)
- [注释规范](#注释规范)

## 代码风格

### ESLint

项目使用 ESLint 进行代码检查，配置文件为 `.eslintrc.cjs`。

#### 运行检查

```bash
# 检查并自动修复
pnpm lint
```

#### 主要规则

- 使用 2 个空格缩进
- 使用单引号
- 语句末尾不加分号（由 Prettier 处理）
- 对象和数组最后一个元素后不加逗号

### Prettier

项目使用 Prettier 进行代码格式化，配置文件为 `.prettierrc`。

#### 运行格式化

```bash
# 格式化所有文件
pnpm format
```

#### 主要规则

- 单行最大长度：100 字符
- 使用单引号
- 语句末尾不加分号
- 使用 2 个空格缩进
- 对象和数组最后一个元素后不加逗号

### 自动格式化

项目配置了 `lint-staged` 和 `husky`，在提交代码前会自动运行 ESLint 和 Prettier。

## 命名规范

### 文件命名

#### Vue 组件

- **PascalCase**：组件文件使用大驼峰命名
- 示例：`UserProfile.vue`、`NavBar.vue`

#### 工具函数 / Hooks

- **camelCase**：使用小驼峰命名
- 示例：`useRequest.ts`、`formatDate.ts`

#### 常量文件

- **camelCase**：使用小驼峰命名
- 示例：`api.ts`、`storage.ts`

#### 类型定义

- **camelCase**：使用小驼峰命名
- 示例：`user.ts`、`api.ts`

### 变量命名

#### 变量和函数

- **camelCase**：使用小驼峰命名
- 示例：`userName`、`getUserInfo()`

#### 常量

- **UPPER_SNAKE_CASE**：全大写，单词间用下划线
- 示例：`API_BASE_URL`、`MAX_COUNT`

#### 私有变量

- 以下划线开头：`_privateVariable`

#### 类型 / 接口

- **PascalCase**：使用大驼峰命名
- 示例：`UserInfo`、`ApiResponse`

### 组件命名

#### Vue 组件

- **PascalCase**：使用大驼峰命名
- 示例：`<UserProfile />`、`<NavBar />`

#### Props

- **camelCase**：使用小驼峰命名
- 示例：`userName`、`isVisible`

#### Events

- **kebab-case**：使用短横线命名
- 示例：`@user-updated`、`@item-clicked`

## 文件组织

### 目录结构

```
src/
├── api/              # API 接口定义
├── assets/           # 静态资源（图片、样式等）
├── components/       # 通用组件（PascalCase）
├── config/           # 配置文件
├── constants/        # 常量定义
├── hooks/            # 组合式函数（Composables）
├── router/           # 路由配置
├── store/            # Pinia 状态管理
├── types/            # TypeScript 类型定义
├── utils/            # 工具函数
└── views/            # 页面组件（PascalCase）
```

### 文件导入顺序

1. Vue 相关导入（`vue`、`vue-router` 等）
2. 第三方库导入（`axios`、`ant-design-vue` 等）
3. 项目内部导入（`@/utils`、`@/types` 等）
4. 类型导入（`import type { ... }`）

```typescript
// ✅ 正确的导入顺序
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { request } from '@/utils/request'
import type { UserInfo } from '@/types/user'
```

## TypeScript 规范

### 类型定义

- 优先使用 `interface` 定义对象类型
- 使用 `type` 定义联合类型、交叉类型等复杂类型
- 避免使用 `any`，使用 `unknown` 或具体类型

```typescript
// ✅ 推荐
interface UserInfo {
  id: number
  name: string
}

type Status = 'active' | 'inactive'

// ❌ 不推荐
const user: any = {}
```

### 类型导入

- 使用 `import type` 导入类型，避免运行时导入

```typescript
// ✅ 推荐
import type { UserInfo } from '@/types/user'

// ❌ 不推荐
import { UserInfo } from '@/types/user'
```

### 泛型使用

- 使用有意义的泛型名称，通常使用单个大写字母

```typescript
// ✅ 推荐
function useRequest<T, P = any>(apiCall: (params?: P) => Promise<T>)

// ❌ 不推荐
function useRequest<A, B>(apiCall: (params?: B) => Promise<A>)
```

## Vue 组件规范

### 组件结构

组件应该按照以下顺序组织：

1. `<template>` - 模板
2. `<script setup>` - 脚本
3. `<style>` - 样式

```vue
<template>
  <div class="component-name">
    <!-- 模板内容 -->
  </div>
</template>

<script setup lang="ts">
// 脚本内容
</script>

<style scoped>
/* 样式内容 */
</style>
```

### 组件 Props

- 使用 `defineProps` 定义 props
- 为 props 提供类型定义和默认值
- 使用 `withDefaults` 定义默认值

```vue
<script setup lang="ts">
interface Props {
  title: string
  count?: number
  visible?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  count: 0,
  visible: true
})
</script>
```

### 组件 Emits

- 使用 `defineEmits` 定义 emits
- 为 emits 提供类型定义

```vue
<script setup lang="ts">
interface Emits {
  (e: 'update', value: string): void
  (e: 'delete', id: number): void
}

const emit = defineEmits<Emits>()
</script>
```

### 响应式数据

- 优先使用 `ref` 和 `reactive`
- 使用 `computed` 处理计算属性
- 使用 `watch` 监听数据变化

```vue
<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const count = ref(0)
const doubleCount = computed(() => count.value * 2)

watch(count, (newVal) => {
  console.log('count changed:', newVal)
})
</script>
```

### 生命周期

- 使用 Composition API 的生命周期钩子

```vue
<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

onMounted(() => {
  // 组件挂载后的逻辑
})

onUnmounted(() => {
  // 组件卸载前的清理
})
</script>
```

## Git 提交规范

### 提交格式

使用 **Conventional Commits** 规范：

```
<type>(<scope>): <subject>

<body>

<footer>
```

### 提交类型

- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档变更
- `style`: 代码格式（不影响代码运行的变动）
- `refactor`: 重构
- `perf`: 性能优化
- `test`: 增加测试
- `chore`: 构建过程或辅助工具的变动
- `revert`: 回退
- `build`: 打包
- `ci`: 持续集成修改

### 提交示例

```bash
# ✅ 正确的提交
git commit -m "feat: 添加用户登录功能"
git commit -m "fix: 修复登录页面样式问题"
git commit -m "docs: 更新 README 使用说明"

# ❌ 错误的提交（会被拒绝）
git commit -m "添加功能"
git commit -m "fix bug"
```

### 提交前检查

项目配置了 `commitlint`，提交时会自动验证格式。错误的提交信息会被拒绝。

## 注释规范

### 文件头部注释

每个文件顶部应该包含文件说明注释：

```typescript
/*
 * @Author: liaokt
 * @Description: 用户相关 API 接口
 * @Date: 2025-11-06 10:00:00
 * @LastEditors: liaokt
 * @LastEditTime: 2025-11-06 10:00:00
 */
```

### 函数注释

使用 JSDoc 格式注释函数：

```typescript
/**
 * 获取用户信息
 * @param id 用户 ID
 * @returns 用户信息
 */
export function getUserInfo(id: number): Promise<UserInfo> {
  // ...
}
```

### 复杂逻辑注释

对于复杂的业务逻辑，应该添加注释说明：

```typescript
// 处理用户登录逻辑
// 1. 验证用户名和密码
// 2. 生成 token
// 3. 保存用户信息到 localStorage
const handleLogin = async () => {
  // ...
}
```

### 注释原则

- 注释应该解释**为什么**，而不是**是什么**
- 代码应该自解释，避免不必要的注释
- 使用中文注释（项目使用中文）

## 最佳实践

### 1. 代码复用

- 将重复的逻辑提取为 Hooks 或工具函数
- 将通用的 UI 组件提取为公共组件

### 2. 错误处理

- 使用 try-catch 处理异步错误
- 提供友好的错误提示

### 3. 性能优化

- 使用 `v-show` 替代 `v-if`（频繁切换时）
- 使用 `computed` 替代 `method`（计算属性）
- 合理使用 `v-memo` 和 `v-once`

### 4. 安全性

- 不要在前端存储敏感信息
- 验证用户输入
- 使用 HTTPS

### 5. 可维护性

- 保持函数简短，单一职责
- 使用有意义的变量名
- 避免深度嵌套

## 工具使用

### 代码检查

```bash
# ESLint 检查
pnpm lint

# TypeScript 类型检查
pnpm type-check

# Prettier 格式化
pnpm format
```

### Git Hooks

项目配置了以下 Git Hooks：

- **pre-commit**: 提交前自动运行 ESLint 和 Prettier
- **commit-msg**: 提交时验证 commit message 格式

## 参考资源

- [Vue 3 官方文档](https://cn.vuejs.org/)
- [TypeScript 官方文档](https://www.typescriptlang.org/)
- [ESLint 规则](https://eslint.org/docs/rules/)
- [Prettier 配置](https://prettier.io/docs/en/options.html)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

**注意：** 所有开发人员都应该遵循这些规范。如有疑问，请及时沟通。

