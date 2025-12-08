<!--
 * @Author: liaokt
 * @Description:
 * @Date: 2025-12-05 15:24:30
 * @LastEditors: liaokt
 * @LastEditTime: 2025-12-05 15:26:47
-->

# 权限配置模块

权限配置采用模块化结构，每个模块独立管理自己的权限配置。

## 目录结构

```
src/config/permissions/
├── index.ts          # 入口文件，导出所有权限配置和工具函数
├── types.ts          # 类型定义
├── user.ts           # 用户管理模块权限
├── role.ts           # 角色管理模块权限
├── settings.ts       # 系统设置模块权限
└── README.md         # 说明文档
```

## 添加新模块权限

### 1. 创建模块文件

在 `src/config/permissions/` 目录下创建新的模块文件，例如 `product.ts`：

```typescript
/**
 * 产品管理模块权限配置
 */

import type { PermissionNodeConfig } from './types'

export const productPermissions: Record<string, PermissionNodeConfig> = {
  M04: {
    name: '产品管理',
    routeName: 'Product',
    M0401: {
      name: '产品列表',
      routeName: 'ProductList',
      A040101: { name: '新增产品', action: 'add' },
      A040102: { name: '编辑产品', action: 'edit' },
      A040103: { name: '删除产品', action: 'delete' },
      A040104: { name: '查看产品', action: 'view' }
    }
  }
}
```

### 2. 在入口文件中导入并合并

在 `src/config/permissions/index.ts` 中：

```typescript
import { productPermissions } from './product'

export const PERMISSION_CONFIG: Record<string, PermissionNodeConfig> = {
  ...userPermissions,
  ...rolePermissions,
  ...settingsPermissions,
  ...productPermissions // 添加新模块
}

// 导出新模块
export { productPermissions } from './product'
```

## 权限编码规则

### 菜单权限（M 开头）

- 一级菜单：`M01`, `M02`, `M03`...
- 二级菜单：`M0101`, `M0102`, `M0201`...
- 三级菜单：`M010101`, `M010102`...

### 操作权限（A 开头）

操作权限编码 = `A` + 父菜单的数字部分 + 2位操作序号

**示例**：

- `M0101` 下的操作：`A010101`, `A010102`... (A + 0101 + 序号)
- `M0201` 下的操作：`A020101`, `A020102`... (A + 0201 + 序号)

## 使用方式

### 导入权限配置

```typescript
// 导入所有权限配置
import { PERMISSION_CONFIG, getPermissionByCode } from '@/config/permissions'

// 导入特定模块权限
import { userPermissions } from '@/config/permissions'
```

### 在组件中使用

```vue
<template>
  <mx-button permission="A010101" icon-type="add"> 新增用户 </mx-button>
</template>

<script setup lang="ts">
import { getPermissionByCode } from '@/config/permissions'

// 获取权限信息
const perm = getPermissionByCode('A010101')
// { code: 'A010101', name: '新增用户', type: 'button', ... }
</script>
```

## 优势

1. **模块化**：每个模块独立管理，易于维护
2. **可扩展**：添加新模块只需创建新文件并导入
3. **清晰**：权限配置按业务模块组织
4. **类型安全**：TypeScript 类型支持
